package com.example.masterReparateur.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReparationRequest {
	private List<ProblemModelRequest> problems;

}
