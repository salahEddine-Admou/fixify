package com.example.masterReparateur.models;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import lombok.Data;

@Entity
@Data

public class Client extends User {
	@Column(name = "imageprofile")
	private String imageProfile;

	@OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	List<Reservation> reservations = new ArrayList<>();

	@OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	List<Order> orders = new ArrayList<>();

}
