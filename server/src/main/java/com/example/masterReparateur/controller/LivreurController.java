package com.example.masterReparateur.controller;

import com.example.masterReparateur.dto.LivreurDto;
import com.example.masterReparateur.exception.MasterException;
import com.example.masterReparateur.models.Reservation;
import com.example.masterReparateur.service.AuthService;
import com.example.masterReparateur.service.LivreurService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.AllArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/api/livreur")
@AllArgsConstructor
public class LivreurController {

	private final LivreurService livreurService;

	@GetMapping
	public ResponseEntity<List<LivreurDto>> getAllLivreurs() {
		List<LivreurDto> livreurs = livreurService.getAllLivreurs();
		return new ResponseEntity<>(livreurs, HttpStatus.OK);
	}

	@GetMapping("/{id}")
	public ResponseEntity<LivreurDto> getLivreurById(@PathVariable Long id) {
		LivreurDto livreur = livreurService.getLivreurById(id);
		return new ResponseEntity<>(livreur, HttpStatus.OK);
	}

	@PostMapping
	public ResponseEntity<LivreurDto> createLivreur(@RequestBody LivreurDto livreurDTO) {
		LivreurDto createdLivreur = livreurService.createLivreur(livreurDTO);
		return new ResponseEntity<>(createdLivreur, HttpStatus.CREATED);
	}

	@PutMapping("/{id}")
	public ResponseEntity<LivreurDto> updateLivreur(@PathVariable Long id, @RequestBody LivreurDto livreurDTO) {
		LivreurDto updatedLivreur = livreurService.updateLivreur(id, livreurDTO);
		return new ResponseEntity<>(updatedLivreur, HttpStatus.OK);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteLivreur(@PathVariable Long id) {
		livreurService.deleteLivreur(id);
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}

	@PostMapping("/{username}/accept/{reservationId}/type/{type}")
	public ResponseEntity<String> acceptReservation(@PathVariable Long reservationId, @PathVariable String username,
			@PathVariable String type) {

		livreurService.acceptReservation(reservationId, username, type);
		return new ResponseEntity<>("Resrvation accepte", HttpStatus.OK);
	}

	@PutMapping("/makeDeleverySucces/{id}")
	private ResponseEntity<String> makeDeleverySucces(@PathVariable Long id) {
		livreurService.makeDelivrySucces(id);
		return ResponseEntity.ok("ok");
	}

	@PutMapping("/makeDeleveryNotSucces/{id}")
	private ResponseEntity<String> makeDeleveryNotSucces(@PathVariable Long id) {
		livreurService.makeDelivryNotSucces(id);
		return ResponseEntity.ok("ok");
	}

	@PostMapping("/addDeliveryRetour/{reservationId}/{usernameLivreur}")
	public ResponseEntity<String> addDeliveryRetour(@PathVariable Long reservationId,
			@PathVariable String usernameLivreur) {
		livreurService.addDeliveryRetour(reservationId, usernameLivreur);
		return new ResponseEntity<>("Livraison de retour ajoutée", HttpStatus.OK);
	}

	@PostMapping("/check-available-cin/{cin}")
	public ResponseEntity<String> checkAvailableCIN(@PathVariable String cin) {
		if (livreurService.checkAvailableCin(cin))
			throw new MasterException("Cin exists", HttpStatus.FOUND);
		else
			return ResponseEntity.ok("okay");
	}

	@PostMapping("/check-available-rib/{rib}")
	public ResponseEntity<String> checkAvailableRIB(@PathVariable String rib) {
		if (livreurService.checkAvailableRib(rib))
			throw new MasterException("Rib exists", HttpStatus.FOUND);
		else
			return ResponseEntity.ok("okay");
	}
}
