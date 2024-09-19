package com.example.masterReparateur.models;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
public class Invoice {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;

	@Column(name = "ref")
	private String ref;

	@Column(name = "date")
	private LocalDateTime date;

	@Column(name = "description")
	private String description;

	private double payedAmount;
	private double dueAmount;

	private boolean paid = false;

	@ManyToOne
	private Reservation reservation;

	public Invoice() {

		Random random = new Random();
		int number = 100000 + random.nextInt(900000);

		this.ref = String.valueOf(number);
	}
}
