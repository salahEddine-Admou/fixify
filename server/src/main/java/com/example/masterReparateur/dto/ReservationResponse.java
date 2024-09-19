package com.example.masterReparateur.dto;

import com.example.masterReparateur.models.Delivery;
import com.example.masterReparateur.models.ImageReservation;
import com.example.masterReparateur.models.Invoice;
import com.example.masterReparateur.models.Reservation;
import lombok.Data;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class ReservationResponse {
	private Long id;
	private String date;
	private String ref;

	private String reparateur;
	private String repAddress;
	private String repPhoneNumber;

	private String oldReparateur;
	private String oldrepAddress;
	private String oldrepPhoneNumber;

	private String support;
	private String livreur;

	private List<Delivery> deliveries;
	private List<ImageReservation> imgReservations = new ArrayList<>();
	private List<InvoiceResponse> invoices;
	private boolean success;
	private static final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

	private String client;
	private String address;
	private String phone;

	private String model;
	private String probleme;
	private double price;
	private boolean resolvable;

	public ReservationResponse(Reservation reservation) {
		this.id = reservation.getId();
		this.date = reservation.getDate().format(dateFormatter);
		this.reparateur = reservation.getReparation().getRepairer() != null
				? reservation.getReparation().getRepairer().getFirstName() + " "
						+ reservation.getReparation().getRepairer().getLastName()
				: null;
		this.address = reservation.getClient().getAddress();
		this.phone = reservation.getClient().getPhone();
		this.client = reservation.getClient().getFirstName() + " " + reservation.getClient().getLastName();
		if (reservation.getSupportTechnique() != null) {
			this.support = reservation.getSupportTechnique().getFirstName() + " "
					+ reservation.getSupportTechnique().getLastName();
		}

		this.success = reservation.isSuccess();
		this.repAddress = reservation.getReparation().getRepairer() != null
				? reservation.getReparation().getRepairer().getAddress()
				: null;
		this.deliveries = reservation.getDeliveries();
		this.invoices = reservation.getInvoices().stream().map(InvoiceResponse::new).collect(Collectors.toList());
		this.model = reservation.getReparation().getModel().getSubCategoryModel().getName() + " "
				+ reservation.getReparation().getModel().getName();
		this.probleme = reservation.getReparation().getProblem() != null
				? reservation.getReparation().getProblem().getName()
				: null;
		this.price = reservation.getReparation().getPrice();
		this.ref = reservation.getRef();
		this.resolvable = reservation.isResolvable();
		this.imgReservations = reservation.getImageReservations();
		this.repPhoneNumber = reservation.getReparation().getRepairer() != null
				? reservation.getReparation().getRepairer().getPhone()
				: null;
		if (reservation.getOldRepairer() != null) {
			this.oldrepAddress = reservation.getOldRepairer().getAddress();
			this.oldReparateur = reservation.getOldRepairer().getFirstName() + " "
					+ reservation.getOldRepairer().getLastName();
			this.oldrepPhoneNumber = reservation.getOldRepairer().getPhone();
		}
	}
}
