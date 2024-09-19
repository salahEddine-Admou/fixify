package com.example.masterReparateur.models;

import javax.persistence.*;

import com.example.masterReparateur.dto.ReservationRequest;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
public class Reservation {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;

	@Column(name = "date")
	private LocalDateTime date;

	@Column(columnDefinition = "boolean default true")
	private boolean resolvable;

	@Column(name = "success")
	private boolean success;

	@Column(name = "description")
	private String description;

	@Column(name = "ref")
	private String ref;

	@ManyToOne
	private SupportTechnique supportTechnique;

	@ManyToOne
	private Client client;

	@ManyToOne
	private Repairer oldRepairer;

	@ManyToOne
	private Reparation reparation;

	@JsonIgnoreProperties("reservation")
	@OneToMany(mappedBy = "reservation", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	private List<Delivery> deliveries = new ArrayList<>();

	@JsonIgnoreProperties("reservation")
	@OneToMany(mappedBy = "reservation", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	private List<Invoice> invoices = new ArrayList<>();

	@JsonIgnoreProperties("reservation")
	@OneToMany(mappedBy = "reservation", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	private List<ImageReservation> imageReservations = new ArrayList<>();

	public Reservation() {
		Random random = new Random();
		int number = 100000 + random.nextInt(900000);

		this.ref = String.valueOf(number);
		this.resolvable = true;
	}

}
