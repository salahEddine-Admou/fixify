package com.example.masterReparateur.controller;

import org.springframework.web.bind.annotation.RestController;

import com.example.masterReparateur.service.InvoiceService;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/invoice")
@AllArgsConstructor
public class InvoiceController {

	private final InvoiceService invoiceService;

	@PutMapping("/{id}/make-paid")
	public ResponseEntity<String> makePaid(@PathVariable Long id) {
		invoiceService.makePaid(id);

		return new ResponseEntity<>("Paid", HttpStatus.OK);
	}

	@PutMapping("/{id}/make-unpaid")
	public ResponseEntity<String> makeUnpaid(@PathVariable Long id) {
		invoiceService.makeUnpaid(id);

		return new ResponseEntity<>("unpaid", HttpStatus.OK);
	}

}
