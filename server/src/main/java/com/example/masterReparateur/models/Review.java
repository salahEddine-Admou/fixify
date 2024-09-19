package com.example.masterReparateur.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Review {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(name = "rating")
	private double rating;
	@Column(name = "content")
	private String content;

	@JsonIgnoreProperties({ "orders", "reservations" })
	@ManyToOne
	@JoinColumn(name = "client_id")
	private Client client;

	@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "repairer_id")
	private Repairer repairer;
}