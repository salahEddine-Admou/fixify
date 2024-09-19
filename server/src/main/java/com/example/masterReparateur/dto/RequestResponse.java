package com.example.masterReparateur.dto;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.example.masterReparateur.models.Delivery;
import com.example.masterReparateur.models.Repairer;
import com.example.masterReparateur.models.Request;
import com.example.masterReparateur.models.Reservation;

import lombok.Data;

@Data
public class RequestResponse {

	/**
	 * InnerRequestResponse
	 */
	@Data
	private class RepairerRes {
		private String name;
		private Long id;

	}

	private Long id;
	private String date;
	private List<RepairerRes> repairers = new ArrayList<>();

	private String reparateur;
	private Long oldRepairerId;
	private String support;
	private String livreur;

	private String client;
	private String address;
	private String phone;

	private String model;
	private String probleme;

	private static final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

	public RequestResponse(Request requestResponse, List<Repairer> repairers) {
		this.id = requestResponse.getId();
		this.date = requestResponse.getDate().format(dateFormatter);
		this.reparateur = requestResponse.getRepairer().getFirstName() + " "
				+ requestResponse.getRepairer().getLastName();
		;
		this.address = requestResponse.getClient().getAddress();
		this.phone = requestResponse.getClient().getPhone();
		this.client = requestResponse.getClient().getFirstName() + " " + requestResponse.getClient().getLastName();
		;

		this.model = requestResponse.getModel().getSubCategoryModel().getName() + " "
				+ requestResponse.getModel().getName();
		this.probleme = requestResponse.getProblem().getName();
		this.oldRepairerId = requestResponse.getRepairer().getId();

		for (Repairer repairer : repairers) {
			RepairerRes repairerRes = new RepairerRes();
			repairerRes.setName(repairer.getFirstName() + " " + repairer.getLastName());
			repairerRes.setId(repairer.getId());
			this.repairers.add(repairerRes);
		}

	}

}
