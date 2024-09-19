package com.example.masterReparateur.models;

import javax.persistence.*;

@Entity
public class Reclamation {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;

	@Column(name = "description")
	private String description;

	@ManyToOne
	private User user;

	public Reclamation() {
	}

	public Long getId() {
		return id;
	}

	public String getDescription() {
		return description;
	}

	public User getUser() {
		return user;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public void setUser(User user) {
		this.user = user;
	}
}
