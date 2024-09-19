package com.example.masterReparateur.models;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Entity
@Data
public class Livreur extends User {
	@Column(name = "cin")
	private String cin;
	private String rib;
	@Column(name = "imageprofile")
	private String imageProfile;

	@Column(name = "description")
	private String description;

	@JsonIgnoreProperties("livreur")
	@OneToMany(mappedBy = "livreur", cascade = CascadeType.ALL)
	List<CinPhoto> cinPhotos = new ArrayList<>();

	@JsonIgnore
	@OneToMany(mappedBy = "livreur", cascade = CascadeType.ALL)
	List<Delivery> deliveries = new ArrayList<>();

}
