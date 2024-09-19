package com.example.masterReparateur.controller;

import com.example.masterReparateur.dto.ModelResponse;
import com.example.masterReparateur.dto.ProblemModelRequest;
import com.example.masterReparateur.dto.ProblemTypeDto;
import com.example.masterReparateur.dto.ProblemTypeResponse;
import com.example.masterReparateur.dto.RegisterRequest;
import com.example.masterReparateur.dto.RepairerDto;
import com.example.masterReparateur.dto.RepairerProfileDto;
import com.example.masterReparateur.dto.ReparationRequest;
import com.example.masterReparateur.dto.ReparationResponse;
import com.example.masterReparateur.dto.SearchDto;
import com.example.masterReparateur.dto.SubCategoryDto;
import com.example.masterReparateur.dto.SubCategoryResponse;
import com.example.masterReparateur.exception.MasterException;
import com.example.masterReparateur.models.Model;
import com.example.masterReparateur.models.Problem;
import com.example.masterReparateur.models.Repairer;
import com.example.masterReparateur.models.Reparation;
import com.example.masterReparateur.models.SubCategoryModel;
import com.example.masterReparateur.repository.*;

import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.masterReparateur.service.ModelService;
import com.example.masterReparateur.service.ProblemService;
import com.example.masterReparateur.service.RepairerService;
import com.example.masterReparateur.service.SubcategoryModelService;

import lombok.AllArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/Repairer")
@AllArgsConstructor
public class RepairerController {
	private final RepairerService repairerService;
	private final RepairerRepo repairerRepo;
	private final ReservationRepo reservationRepo;

	@GetMapping
	public ResponseEntity<List<Repairer>> getAllRepairers() {
		List<Repairer> repairers = repairerService.getAllRepairers();
		return new ResponseEntity<>(repairers, HttpStatus.OK);
	}

	@GetMapping("/Pro")
	public ResponseEntity<List<Repairer>> getAllProRepairers() {
		List<Repairer> repairers = repairerService.getAllProRepairers();
		return new ResponseEntity<>(repairers, HttpStatus.OK);
	}

	@GetMapping("/top")
	public ResponseEntity<List<RepairerDto>> getTopRepairers() {
		List<RepairerDto> repairers = repairerService.getTopRepairers();
		return new ResponseEntity<>(repairers, HttpStatus.OK);
	}

	@GetMapping("/{id}")
	public ResponseEntity<RepairerDto> getRepairerById(@PathVariable Long id) {
		RepairerDto repairer = repairerService.getRepairerById(id);
		return new ResponseEntity<>(repairer, HttpStatus.OK);
	}

	@PostMapping
	public ResponseEntity<RepairerDto> createRepairer(@RequestBody RepairerDto repairerDTO) {
		RepairerDto createdRepairer = repairerService.createRepairer(repairerDTO);
		return new ResponseEntity<>(createdRepairer, HttpStatus.CREATED);
	}

	@PutMapping("/{id}")
	public ResponseEntity<RepairerDto> updateRepairer(@PathVariable Long id, @RequestBody RepairerDto repairerDTO) {
		System.out.println(repairerDTO);
		RepairerDto updatedRepairer = repairerService.updateRepairer(id, repairerDTO);
		return new ResponseEntity<>(updatedRepairer, HttpStatus.OK);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteRepairer(@PathVariable Long id) {
		repairerService.deleteRepairer(id);
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}

	@PostMapping("/signup")
	public ResponseEntity<String> signup(@Valid @RequestBody RepairerDto repairerDto) {
		if (repairerRepo.existsByUsername(repairerDto.getUsername())) {
			return new ResponseEntity<>("Username déjà existe", HttpStatus.OK);
		}
		repairerService.signup(repairerDto);
		return new ResponseEntity<>("Repairer registration successful", HttpStatus.OK);
	}

	@PostMapping("/{repairerId}/assign-problem")
	public ResponseEntity<List<Reparation>> assignProblems(@RequestBody Map<String, Object> requestBody,
			@PathVariable Long repairerId) {
		List<ProblemModelRequest> problems = extractProblemsFromRequest(requestBody, repairerId);
		ReparationRequest reparationRequest = new ReparationRequest();
		reparationRequest.setProblems(problems);
		System.out.println(reparationRequest);
		List<Reparation> reparations = repairerService.createReparations(reparationRequest, repairerId);

		return ResponseEntity.ok(reparations);

	}

	@GetMapping("/{repairerId}/reparations")
	public List<ReparationResponse> getReparations(@PathVariable Long repairerId) {
		return repairerService.getReparations(repairerId);
	}

	@PostMapping("/search-repairers")
	public ResponseEntity<List<RepairerProfileDto>> getQualifiedRepairers(@RequestBody SearchDto searchDto,
			@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "1") int size) {
		List<RepairerProfileDto> repairers = repairerService.getQualifiedRepairers(searchDto, page, size);
		return new ResponseEntity<>(repairers, HttpStatus.OK);
	}

	private List<ProblemModelRequest> extractProblemsFromRequest(Map<String, Object> requestData, Long repairerId) {
		List<ProblemModelRequest> problems = new ArrayList<>();
		for (String key : requestData.keySet()) {
			if (key.startsWith("problemType-")) {
				Long problemType = Long.parseLong(requestData.get(key).toString());
				@SuppressWarnings("unchecked")
				List<Integer> models = (List<Integer>) requestData.get("modeles-" + key.substring(12));
				ProblemModelRequest problemModelDTO = new ProblemModelRequest();
				problemModelDTO.setProblemType(problemType);
				problemModelDTO.setModels(models);
				problems.add(problemModelDTO);
			}
		}
		return problems;
	}

	@DeleteMapping("/delete/{reparateurId}/reparations")
	public void supprimerReparationsParReparateur(@PathVariable Long reparateurId) {
		repairerService.supprimerReparationsParReparateur(reparateurId);
	}

	@GetMapping("/{id}/repairerProfil")
	public ResponseEntity<RepairerProfileDto> getRepairerProfile(@PathVariable Long id) {
		RepairerProfileDto repairerProfileDto = repairerService.getRepairerProfile(id); // Correction ici
		return ResponseEntity.ok().body(repairerProfileDto);
	}

	@PutMapping("/{repairerId}/enablePro")
	public ResponseEntity<Void> enablePro(@PathVariable Long repairerId) {
		repairerService.enablePro(repairerId);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@PutMapping("/{repairerId}/disablePro")
	public ResponseEntity<Void> disablePro(@PathVariable Long repairerId) {
		repairerService.disablePro(repairerId);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@PutMapping("/{repairerId}/Dispo")
	public ResponseEntity<Void> repairerDispo(@PathVariable Long repairerId) {
		repairerService.makeRepairerDispo(repairerId);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@PutMapping("/{repairerId}/NonDispo")
	public ResponseEntity<Void> repairerNonDispo(@PathVariable Long repairerId) {
		repairerService.makeRepairerNonDispo(repairerId);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@GetMapping("/findOne/{username}")
	public ResponseEntity<Repairer> getRepairerByUsername(@PathVariable String username) {
		Repairer repairer = repairerService.findRepairerByUsername(username);
		return ResponseEntity.ok().body(repairer);
	}

	@PostMapping("/check-available-cin/{cin}")
	public ResponseEntity<String> checkAvailableCIN(@PathVariable String cin) {
		if (repairerService.checkAvailableCin(cin))
			throw new MasterException("Cin exists", HttpStatus.FOUND);
		else
			return ResponseEntity.ok("okay");
	}

	@PostMapping("/check-available-rib/{rib}")
	public ResponseEntity<String> checkAvailableRIB(@PathVariable String rib) {
		if (repairerService.checkAvailableRib(rib))
			throw new MasterException("Rib exists", HttpStatus.FOUND);
		else
			return ResponseEntity.ok("okay");
	}

	@PostMapping("/upload")
	public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
		repairerService.saveAllUplaod(file);
		return ResponseEntity.status(HttpStatus.OK).body("File uploaded and data saved successfully");
	}

	@GetMapping("/stats/{username}")
	public ResponseEntity<Map<String, Long>> getDashboardStats(@PathVariable String username) {
		Map<String, Long> stats = new HashMap<>();
		stats.put("totalReservation", repairerService.countRepairerUsername(username));
		stats.put("totalReservationSucces", repairerService.countSuccessTrueByRepairerUsername(username));
		stats.put("totalReservationNonSucces", repairerService.countSuccessFalseByRepairerUsername(username));
		return ResponseEntity.ok(stats);
	}

	@GetMapping("/top-clients/{username}")
	public ResponseEntity<List<Map<String, Object>>> getTopClients(@PathVariable String username) {
		List<Map<String, Object>> topClients = reservationRepo.findTopClientsByRepairer(PageRequest.of(0, 5), username);
		return ResponseEntity.ok(topClients);
	}

	@PostMapping("/add-fav/client/{client}/repairer/{repairer}")
	public ResponseEntity<String> addToFav(@PathVariable String client, @PathVariable Long repairer) {
		repairerService.addToFav(client, repairer);
		return ResponseEntity.ok().body("added to fav");
	}

	@DeleteMapping("/delete-fav/client/{client}/repairer/{repairer}")
	public ResponseEntity<String> deleteFromFav(@PathVariable String client, @PathVariable Long repairer) {
		repairerService.deleteFromFav(client, repairer);
		return ResponseEntity.ok().body("deleted from fav");
	}

	@GetMapping("/list-fav/client/{client}")
	public ResponseEntity<List<RepairerDto>> listFav(@PathVariable String client) {
		List<RepairerDto> repairers = repairerService.listFav(client);
		return ResponseEntity.ok().body(repairers);

	}

	@GetMapping("/is-fav/client/{client}/repairer/{repairer}")
	public ResponseEntity<Boolean> isFav(@PathVariable String client, @PathVariable Long repairer) {
		boolean isfav = repairerService.isFav(client, repairer);
		return ResponseEntity.ok().body(isfav);
	}

	@GetMapping("/reservationsProblems/{username}")
	public ResponseEntity<List<Map<String, Object>>> countReservationsByProblemAndRepairer(
			@PathVariable String username) {
		List<Map<String, Object>> result = reservationRepo.countReservationsByProblemAndRepairerUsername(username);
		return ResponseEntity.ok(result);
	}

}
