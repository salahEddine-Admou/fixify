package com.example.masterReparateur.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PriceRequest {
	private List<Double> prices;
	private List<Long> problemsIds;
	private Long modelId;
	private String username;

	// Getters and setters
}
