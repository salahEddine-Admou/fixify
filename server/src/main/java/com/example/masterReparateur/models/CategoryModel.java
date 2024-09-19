package com.example.masterReparateur.models;

import java.util.ArrayList;
import java.util.List;
import com.example.masterReparateur.models.Problem;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Entity
@Data
public class CategoryModel {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;
	@Column(name = "name", unique = true)
	private String name;
	@Column(name = "description")
	private String description;

	@JsonIgnoreProperties("categoryModel")
	@OneToMany(mappedBy = "categoryModel", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	private List<SubCategoryModel> subCategoryModels = new ArrayList<>();

	@OneToMany(mappedBy = "categoryModel", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	private List<Problem> problems = new ArrayList<>();

}
