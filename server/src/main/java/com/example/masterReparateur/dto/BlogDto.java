package com.example.masterReparateur.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BlogDto {
	private Long id;
	private String name;
	private String description;
	private String imageBlog;
	private Long modelId;
	private Long problemId;
	private String model;
	private String problem;
}
