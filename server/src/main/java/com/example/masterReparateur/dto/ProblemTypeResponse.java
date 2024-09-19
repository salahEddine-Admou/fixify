package com.example.masterReparateur.dto;

import com.example.masterReparateur.models.Problem;

import lombok.Data;

@Data
public class ProblemTypeResponse {
	private Long id;
	private String name;
	private String description;
	private String category;
	private Long categoryId;

	public ProblemTypeResponse(Problem problem) {
		this.id = problem.getId();
		this.name = problem.getName();
		this.description = problem.getDescription();
		this.category = problem.getCategoryModel().getName();
		this.categoryId = problem.getCategoryModel().getId();
	}
}
