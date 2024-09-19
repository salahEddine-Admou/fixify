package com.example.masterReparateur.controller;

import com.example.masterReparateur.dto.SupportTechniqueResponse;
import com.example.masterReparateur.service.SupportTechniqueService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/SupportTechnique")
@AllArgsConstructor
public class SupportTechniqueController {
	private final SupportTechniqueService supportTechniqueService;

	@GetMapping
	public ResponseEntity<List<SupportTechniqueResponse>> getAllSupportsTechnique() {
		List<SupportTechniqueResponse> supportsTechnique = supportTechniqueService.getAllSupportsTechnique();
		return new ResponseEntity<>(supportsTechnique, HttpStatus.OK);
	}

	@GetMapping("/{id}")
	public ResponseEntity<SupportTechniqueResponse> getSupportTechniqueById(@PathVariable Long id) {
		SupportTechniqueResponse supportTechnique = supportTechniqueService.getSupportTechniqueById(id);
		return new ResponseEntity<>(supportTechnique, HttpStatus.OK);
	}

	@PostMapping
	public ResponseEntity<SupportTechniqueResponse> createSupportTechnique(
			@RequestBody SupportTechniqueResponse supportTechniqueResponse) {
		SupportTechniqueResponse createdSupportTechnique = supportTechniqueService
				.createSupportTechnique(supportTechniqueResponse);
		return new ResponseEntity<>(createdSupportTechnique, HttpStatus.CREATED);
	}

	@PutMapping("/{id}")
	public ResponseEntity<SupportTechniqueResponse> updateSupportTechnique(@PathVariable Long id,
			@RequestBody SupportTechniqueResponse supportTechniqueResponse) {
		SupportTechniqueResponse updatedSupportTechnique = supportTechniqueService.updateSupportTechnique(id,
				supportTechniqueResponse);
		return new ResponseEntity<>(updatedSupportTechnique, HttpStatus.OK);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteSupportTechnique(@PathVariable Long id) {
		supportTechniqueService.deleteSupportTechnique(id);
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}

}