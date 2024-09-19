package com.example.masterReparateur.dto;

import com.example.masterReparateur.models.Invoice;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class InvoiceResponse {
	private Long id;
	// private ReservationResponse reservation;
	private String description;
	private boolean paid;

	public InvoiceResponse(Invoice invoice) {

		this.id = invoice.getId();
		this.description = invoice.getDescription();
		this.paid = invoice.isPaid();

	}

}
