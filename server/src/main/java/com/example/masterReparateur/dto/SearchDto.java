package com.example.masterReparateur.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SearchDto {
	private Long modelId;
	private Long ProblemId;
	private String city;
}
