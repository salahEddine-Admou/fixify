package com.example.masterReparateur.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.masterReparateur.dto.RequestResponse;
import com.example.masterReparateur.dto.ReservationResponse;
import com.example.masterReparateur.models.Reservation;
import com.example.masterReparateur.service.RequestService;
import com.example.masterReparateur.service.ReservationService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/request")
@AllArgsConstructor
public class RequestController {

	private final RequestService requestService;

	@GetMapping("/new/{id}")
	public ResponseEntity<RequestResponse> getNewReservationDetail(@PathVariable Long id) {
		RequestResponse reservation = requestService.getNewRequestDetail(id);
		return new ResponseEntity<>(reservation, HttpStatus.OK);
	}

	@PostMapping("/{reqId}/repairer/{id}/oldRepairer/{oldId}/changeReserv")
	public ResponseEntity<Void> changeRepairer(@PathVariable Long reqId, @PathVariable Long id,
			@PathVariable Long oldId) {
		requestService.changeRepairer(id, reqId, oldId);
		return new ResponseEntity<>(HttpStatus.OK);
	}

}
