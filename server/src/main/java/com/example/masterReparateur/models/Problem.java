package com.example.masterReparateur.models;

import javax.persistence.*;

import com.example.masterReparateur.dto.ProblemTypeDto;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Problem {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;
	@Column(name = "name")
	private String name;
	@Column(name = "description")
	private String description;

	@OneToMany(mappedBy = "problem", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	private List<Reparation> reparations = new ArrayList<>();

	@JsonIgnore
	@OneToMany(mappedBy = "problem", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	private List<Blog> blogs = new ArrayList<>();

	@JsonIgnore
	@ManyToOne
	private CategoryModel categoryModel;

	public Problem(ProblemTypeDto problem) {
		this.name = problem.getName();
		this.description = problem.getDescription();
	}

}
