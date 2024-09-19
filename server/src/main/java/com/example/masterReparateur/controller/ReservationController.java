package com.example.masterReparateur.controller;

import com.example.masterReparateur.dto.*;
import com.example.masterReparateur.models.Repairer;
import org.hibernate.validator.constraints.Mod11Check;
import org.springframework.web.bind.annotation.*;

import com.example.masterReparateur.dto.ClientReservationResponse;
import com.example.masterReparateur.dto.InvoiceRequest;
import com.example.masterReparateur.dto.ReservationRequest;
import com.example.masterReparateur.dto.ReservationResponse;
import com.example.masterReparateur.models.Reservation;

import com.example.masterReparateur.service.ReservationService;

import lombok.AllArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/reservation") // Standardize route to plural form
@AllArgsConstructor
public class ReservationController {

	private final ReservationService reservationService;

	@PostMapping("/create")
	public ResponseEntity<Void> create(@RequestBody ReservationRequest reservationRequest) {
		Reservation reservation = reservationService.create(reservationRequest);
		return new ResponseEntity<>(HttpStatus.CREATED);
	}

	@PostMapping("/Affecter/{ref}")
	public ResponseEntity<Void> Affecter(@PathVariable String ref, @RequestBody Affecter affecter) {
		Reservation reservation = reservationService.Affecter(ref, affecter);
		return new ResponseEntity<>(HttpStatus.CREATED);
	}

	@PostMapping("/createReservationForProblemOther")
	public ResponseEntity<Void> createReservationForProblemOther(@RequestBody ReservationRequest reservationRequest) {
		System.out.println(reservationRequest);
		ReservationRequest reservationRequest1 = reservationService
				.createReservationTypeProblemAutre(reservationRequest);
		return new ResponseEntity<>(HttpStatus.CREATED);
	}

	@GetMapping("/ReservationsWithNullReparationDetails")
	public ResponseEntity<List<ReservationResponse>> getAllReservationsWithNullReparationDetails() {
		List<ReservationResponse> reservations = reservationService.findReservationsWithNullReparationDetails();
		return new ResponseEntity<>(reservations, HttpStatus.OK);
	}

	@GetMapping
	public ResponseEntity<List<ReservationResponse>> getAllReservations() {
		List<ReservationResponse> reservations = reservationService.getAllReservations();
		return new ResponseEntity<>(reservations, HttpStatus.OK);
	}

	@GetMapping("/new/{id}")
	public ResponseEntity<ReservationResponse> getNewReservationDetail(@PathVariable Long id) {
		ReservationResponse reservation = reservationService.getNewReservationDetail(id);
		return new ResponseEntity<>(reservation, HttpStatus.OK);
	}

	@GetMapping("/repairer/{username}")
	public ResponseEntity<List<ReservationResponse>> getRepairerReservations(@PathVariable String username) {
		List<ReservationResponse> reservation = reservationService.getRepairerReservations(username);
		return new ResponseEntity<>(reservation, HttpStatus.OK);
	}

	@PutMapping("/{id}/make-success")
	public ResponseEntity<String> makeSuccess(@PathVariable Long id) {
		reservationService.makeSuccess(id);
		return new ResponseEntity<>("Made success", HttpStatus.OK);
	}

	@PostMapping("/gen-invoice")
	public ResponseEntity<String> genInvoice(@RequestBody InvoiceRequest invoiceRequest) {
		reservationService.genInvoice(invoiceRequest);
		return new ResponseEntity<>("Gen success", HttpStatus.OK);
	}

	@GetMapping("/ReservationByLivreur/{username}")
	public ResponseEntity<List<ReservationResponse>> getReservationByLivreur(@PathVariable String username) {
		List<ReservationResponse> reservation = reservationService.getReservationsByLivreurName(username);
		return new ResponseEntity<>(reservation, HttpStatus.OK);
	}

	@GetMapping("/client/{username}/list")
	public ResponseEntity<List<ClientReservationResponse>> getReservationByClient(@PathVariable String username) {
		List<ClientReservationResponse> reservation = reservationService.getClientReservations(username);
		return new ResponseEntity<>(reservation, HttpStatus.OK);
	}

	@PutMapping("/{id}/not-resolved")
	public ResponseEntity<String> makeNotResolved(@PathVariable Long id) {
		reservationService.makeNotResolved(id);
		return new ResponseEntity<>("Made success", HttpStatus.OK);
	}

}
