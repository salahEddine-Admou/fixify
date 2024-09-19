package com.example.masterReparateur.models;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;

import com.example.masterReparateur.dto.ModelRequest;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Model {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;
	@Column(name = "name", unique = true)
	private String name;
	@Column(name = "description")
	private String description;

	@JsonIgnore
	@ManyToOne
	private SubCategoryModel subCategoryModel;

	public Model(ModelRequest modelRequest) {
		this.name = modelRequest.getName();
		this.description = modelRequest.getDescription();
	}

	@OneToMany(mappedBy = "model", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	private List<Reparation> reparations = new ArrayList<>();

	@JsonIgnore
	@OneToMany(mappedBy = "model", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	private List<Blog> blogs = new ArrayList<>();

}
