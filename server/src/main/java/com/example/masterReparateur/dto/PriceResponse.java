package com.example.masterReparateur.dto;

import com.example.masterReparateur.models.Price;
import com.example.masterReparateur.models.Reparation;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PriceResponse {
	private Long id;
	private Long problemType;
	private double price;

	public PriceResponse(Reparation reparation) {
		this.problemType = reparation.getProblem().getId();
		this.price = reparation.getPrice();
		this.id = reparation.getId();
	}
}
