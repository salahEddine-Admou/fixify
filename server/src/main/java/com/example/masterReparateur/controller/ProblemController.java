package com.example.masterReparateur.controller;

import com.example.masterReparateur.dto.PriceRequest;
import com.example.masterReparateur.dto.PriceResponse;
import com.example.masterReparateur.dto.ProblemTypeDto;
import com.example.masterReparateur.dto.ProblemTypeResponse;
import com.example.masterReparateur.exception.MasterException;
import com.example.masterReparateur.models.Price;
import com.example.masterReparateur.models.Problem;
import com.example.masterReparateur.models.SubCategoryModel;
import com.example.masterReparateur.service.ProblemService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/problem")
@AllArgsConstructor
public class ProblemController {

	private final ProblemService problemService;

	@GetMapping
	public ResponseEntity<List<ProblemTypeResponse>> getAllProblems() {
		List<ProblemTypeResponse> problems = problemService.getAllProblems();
		return new ResponseEntity<>(problems, HttpStatus.OK);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Problem> getProblemById(@PathVariable Long id) {
		Problem problem = problemService.getProblemById(id);
		return new ResponseEntity<>(problem, problem != null ? HttpStatus.OK : HttpStatus.NOT_FOUND);
	}

	@PostMapping
	public ResponseEntity<ProblemTypeResponse> createProblem(@RequestBody ProblemTypeDto problem) {
		ProblemTypeResponse createdProblem = problemService.createProblem(problem);
		return new ResponseEntity<>(createdProblem, HttpStatus.CREATED);
	}

	@PutMapping("/{id}")
	public ResponseEntity<ProblemTypeResponse> updateProblem(@PathVariable Long id,
			@RequestBody ProblemTypeDto problem) {
		ProblemTypeResponse updatedProblem = problemService.updateProblem(id, problem);
		return new ResponseEntity<>(updatedProblem, updatedProblem != null ? HttpStatus.OK : HttpStatus.NOT_FOUND);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteProblem(@PathVariable Long id) {
		problemService.deleteProblem(id);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@GetMapping("/model/{id}")
	public ResponseEntity<List<ProblemTypeResponse>> getModelProblems(@PathVariable Long id) {
		List<ProblemTypeResponse> problems = problemService.getModelProblems(id);
		return new ResponseEntity<>(problems, HttpStatus.OK);
	}

	@PostMapping("/tarifs/upload")
	public String handleFileUpload(@RequestParam("file") MultipartFile file,
			@RequestParam("username") String username) {
		try {
			problemService.processExcelFile(file, username);
			return "File uploaded successfully";
		} catch (IOException e) {
			e.printStackTrace();
			return "Failed to upload file";
		}
	}

	@PostMapping("/create-prices/model/{modelId}/repairer/{username}")
	public ResponseEntity<Void> createPrices(@RequestBody Map<String, Object> requestData, @PathVariable Long modelId,
			@PathVariable String username) {
		// Initialize lists to hold prices and model IDs
		System.out.println("creating prices");
		List<Double> prices = new ArrayList<>();
		List<Long> problemIds = new ArrayList<>();

		// Iterate through the requestData map keys to extract prices and model IDs
		for (String key : requestData.keySet()) {
			if (key.startsWith("price-")) {
				Double price = Double.parseDouble(requestData.get(key).toString());
				prices.add(price);
			} else if (key.startsWith("problemType-")) {
				Long problemId = Long.parseLong(requestData.get(key).toString());
				problemIds.add(problemId);
			}
		}

		// Extract problemId from the first price key

		// Create PriceDto object and pass it to the service layer
		PriceRequest priceDto = new PriceRequest();
		priceDto.setPrices(prices);
		priceDto.setUsername(username);
		priceDto.setProblemsIds(problemIds);
		priceDto.setModelId(modelId);
		problemService.createPrices(priceDto);
		return ResponseEntity.status(HttpStatus.CREATED).build();

	}

	@GetMapping("/price/model/{modelId}/problem/{problemId}/repairer/{repId}")
	public ResponseEntity<PriceResponse> getProblemPrice(@PathVariable Long modelId, @PathVariable Long problemId,
			@PathVariable Long repId) {
		PriceResponse priceResponse = problemService.getProblemPrice(modelId, problemId, repId);
		return new ResponseEntity<>(priceResponse, HttpStatus.OK);
	}

	@PostMapping("/check-available/{id}")
	public ResponseEntity<String> checkAvailable(@RequestBody Problem problem, @PathVariable Long id) {
		if (problemService.checkAvailable(problem.getName(), id))
			throw new MasterException("Problem exists", HttpStatus.FOUND);
		else
			return ResponseEntity.ok("okay");
	}
}
