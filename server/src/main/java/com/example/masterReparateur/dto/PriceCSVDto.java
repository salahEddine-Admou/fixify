package com.example.masterReparateur.dto;

import lombok.Data;

@Data
public class PriceCSVDto {
	private String modelName;
	private String problemName;
	private Double price;
	private String username; // Assuming username is provided somewhere
}
