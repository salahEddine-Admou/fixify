package com.example.masterReparateur.models;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class Reparation {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;

	@JsonIgnore
	@ManyToOne
	private Model model;

	@JsonIgnore
	@ManyToOne
	private Problem problem;

	@Column(name = "price")
	private double price;

	@JsonIgnore
	@ManyToOne
	private Repairer repairer;
}
