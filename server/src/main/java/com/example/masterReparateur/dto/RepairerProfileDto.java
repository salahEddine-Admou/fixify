package com.example.masterReparateur.dto;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.example.masterReparateur.models.Model;
import com.example.masterReparateur.models.Portfolio;
import com.example.masterReparateur.models.Reparation;

import com.example.masterReparateur.models.Review;
import lombok.Data;

@Data
public class RepairerProfileDto {
	private Long id;
	private String firstName;
	private double price;
	private String lastName;
	private String city;
	private Boolean gender;
	private String description;
	private String profilePhoto;
	private List<Portfolio> portfolios = new ArrayList<>();
	private Map<String, List<?>> reparations = new HashMap<>();
	private List<Review> reviews = new ArrayList<>();
	private boolean pro;
	private int totalSuccessfulReservations;
	private int totalModels;
}
