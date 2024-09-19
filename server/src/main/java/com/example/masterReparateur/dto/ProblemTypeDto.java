package com.example.masterReparateur.dto;

import com.example.masterReparateur.models.Problem;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProblemTypeDto {
	private String name;
	private String description;
	private Long categoryId;
}
