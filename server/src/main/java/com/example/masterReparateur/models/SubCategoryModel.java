package com.example.masterReparateur.models;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;

import com.example.masterReparateur.dto.ProblemTypeDto;
import com.example.masterReparateur.dto.SubCategoryDto;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubCategoryModel {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;
	@Column(name = "name")
	private String name;
	@Column(name = "description")
	private String description;

	@OneToMany(mappedBy = "subCategoryModel", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	private List<Model> models = new ArrayList<>();

	@JsonIgnore
	@ManyToOne
	private CategoryModel categoryModel;

	public SubCategoryModel(SubCategoryDto subCategoryDto) {
		this.name = subCategoryDto.getName();
		this.description = subCategoryDto.getDescription();
	}

}
