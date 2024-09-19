package com.example.masterReparateur.models;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;

@Entity
@Data
public abstract class User {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;

	private String username;

	@Column(name = "firstname") // Added closing parenthesis here
	private String firstName;

	@Column(name = "lastname") // Added closing parenthesis here
	private String lastName;

	@Column(name = "gender") // Added closing parenthesis here
	private boolean gender;

	@Column(name = "address") // Added closing parenthesis here
	private String address;
	@Column(columnDefinition = "VARCHAR(255) DEFAULT '0600000000'")
	private String phone;

	@Column(name = "city") // Added closing parenthesis here
	private String city;

	@Column(name = "email") // Added closing parenthesis here
	private String email;

	@JsonIgnore
	@Column(name = "password") // Added closing parenthesis here
	private String password;

	private String profilePic;

	private boolean emailVerified;

	@Enumerated(EnumType.STRING)
	private Role role;

	@Column(columnDefinition = "boolean default true")
	private boolean active;

	@OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	private List<Reclamation> reclamations = new ArrayList<>();
}
