package com.example.masterReparateur.models;

import java.time.LocalDateTime;

import javax.persistence.*;

import lombok.Data;

@Entity
@Data
public class Request {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;

	@Column(name = "description")
	private String description;

	@Column(name = "date")
	private LocalDateTime date;

	@ManyToOne
	private Model model;

	@ManyToOne
	private Problem problem;

	@ManyToOne
	private Client client;

	@ManyToOne
	private Repairer repairer;

}
