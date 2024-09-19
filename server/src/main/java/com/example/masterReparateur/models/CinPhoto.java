package com.example.masterReparateur.models;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CinPhoto {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;

	@Column(name = "src", unique = true)
	private String src;

	@JsonIgnore
	@ManyToOne
	private Repairer repairer;

	@JsonIgnore
	@ManyToOne
	private Livreur livreur;
}
