package com.example.masterReparateur.dto;

import java.util.List;

import lombok.Data;

@Data
public class CategoryModelDto {
	private Long id;
	private String name;
	private String description;

	public CategoryModelDto() {
	}

}
