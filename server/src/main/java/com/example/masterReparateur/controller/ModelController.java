package com.example.masterReparateur.controller;

import com.example.masterReparateur.dto.ModelRequest;
import com.example.masterReparateur.dto.ModelResponse;
import com.example.masterReparateur.dto.PriceResponse;
import com.example.masterReparateur.exception.MasterException;
import com.example.masterReparateur.models.Model;
import com.example.masterReparateur.models.SubCategoryModel;
import com.example.masterReparateur.service.ModelService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.AllArgsConstructor;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/model")
@AllArgsConstructor
public class ModelController {

	private final ModelService modelService;

	@GetMapping
	public ResponseEntity<List<ModelResponse>> getAllModels() {
		List<ModelResponse> models = modelService.getAllModels();
		return new ResponseEntity<>(models, HttpStatus.OK);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Model> getModelById(@PathVariable Long id) {
		Model model = modelService.getModelById(id);
		return new ResponseEntity<>(model, model != null ? HttpStatus.OK : HttpStatus.NOT_FOUND);
	}

	@PostMapping
	public ResponseEntity<ModelResponse> createModel(@Valid @RequestBody ModelRequest modelDto) {
		ModelResponse createdModel = modelService.create(modelDto);
		return new ResponseEntity<>(createdModel, HttpStatus.CREATED);
	}

	@PutMapping("/{id}")
	public ResponseEntity<ModelResponse> updateModel(@PathVariable Long id, @Valid @RequestBody ModelRequest modelDto) {
		ModelResponse updatedModel = modelService.updateModel(id, modelDto);
		return new ResponseEntity<>(updatedModel, updatedModel != null ? HttpStatus.OK : HttpStatus.NOT_FOUND);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteModel(@PathVariable Long id) {
		modelService.deleteModel(id);
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}

	@GetMapping("/{modelId}/repairer/{username}/prices")
	public ResponseEntity<List<PriceResponse>> getPricesByModel(@PathVariable Long modelId,
			@PathVariable String username) {
		List<PriceResponse> prices = modelService.getPricesByModel(modelId, username);
		return ResponseEntity.ok(prices);
	}

	@GetMapping("/problem/{problemId}")
	public List<Model> findAllModelsByProblemId(@PathVariable Long problemId) {
		return modelService.findAllModelsByProblemIdAndPrice(problemId);
	}

	@PostMapping("/check-available")
	public ResponseEntity<String> checkAvailable(@RequestBody Model model) {
		if (modelService.checkAvailable(model.getName()))
			throw new MasterException("Model exists", HttpStatus.FOUND);
		else
			return ResponseEntity.ok("okay");
	}
}
