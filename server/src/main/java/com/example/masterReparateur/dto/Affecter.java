package com.example.masterReparateur.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Affecter {
	private double price;
	private Long repairerId;
}
