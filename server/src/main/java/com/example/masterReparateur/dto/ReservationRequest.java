package com.example.masterReparateur.dto;

import com.example.masterReparateur.models.ImageReservation;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReservationRequest {
	private Long modelId;
	private Long problemId;
	private double price;
	private Long repairerId;
	private String username;
	private String description;
	private List<String> imgReservations = new ArrayList<>();

	// Constructors, getters, and setters

}
