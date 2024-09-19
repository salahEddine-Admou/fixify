package com.example.masterReparateur.service;

import org.springframework.stereotype.Service;

import com.example.masterReparateur.models.Invoice;
import com.example.masterReparateur.repository.InvoiceRepo;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class InvoiceService {
	private final InvoiceRepo invoiceRepo;

	public void makePaid(Long id) {
		Invoice invoice = invoiceRepo.findById(id).get();
		invoice.setPaid(true);
		invoiceRepo.save(invoice);
	}

	public void makeUnpaid(Long id) {
		Invoice invoice = invoiceRepo.findById(id).get();
		invoice.setPaid(false);
		invoiceRepo.save(invoice);
	}

}
