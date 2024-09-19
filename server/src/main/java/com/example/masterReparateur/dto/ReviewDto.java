package com.example.masterReparateur.dto;

import com.example.masterReparateur.models.Client;
import com.example.masterReparateur.models.Repairer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewDto {
	private double rating;
	private String content;
	private String client;
	private Long repairerId;
}
