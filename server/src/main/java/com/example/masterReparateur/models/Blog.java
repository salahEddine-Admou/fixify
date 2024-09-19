package com.example.masterReparateur.models;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
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
@NoArgsConstructor
public class Blog {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;
	@Column(name = "name", unique = true)
	private String name;

	@Column(columnDefinition = "TEXT")
	private String description;
	@Column(name = "image_blog")
	private String imageblog;

	@ManyToOne(fetch = FetchType.LAZY)
	private Model model;

	@ManyToOne(fetch = FetchType.LAZY)
	private Problem problem;
}
