package com.example.masterReparateur.models;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Entity
@Data
public class Repairer extends User {

	@Column(name = "cin",

			// ,

			unique = true)
	private String cin;
	@Column(name = "rib", unique = true)
	private String rib;
	@Column(name = "imageprofile")
	private String imageProfile;
	@Column(columnDefinition = "boolean default false")
	private boolean pro;
	@Column(name = "disonible")
	private boolean disonible = false;
	@Column(name = "description")
	private String description;

	@OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	private List<Reservation> reservations = new ArrayList<>();

	@JsonIgnoreProperties("repairer")
	@OneToMany(mappedBy = "repairer", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	private List<CinPhoto> cinPhotos = new ArrayList<>();

	@JsonIgnoreProperties("repairer")
	@OneToMany(mappedBy = "repairer", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	private List<Portfolio> portfolios = new ArrayList<>();

	@JsonIgnoreProperties("repairer")
	@OneToMany(mappedBy = "repairer", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	private List<Reparation> reparations = new ArrayList<>();

	@JsonIgnoreProperties("repairer")
	@OneToMany(mappedBy = "repairer", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	private List<Review> reviews = new ArrayList<>();

}
