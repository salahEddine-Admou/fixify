package com.example.masterReparateur.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReparationResponse {
	private ProblemTypeResponse problem;
	private List<ModelResponse> models = new ArrayList<>();
	private List<ModelResponse> selectedModels = new ArrayList<>();
}
