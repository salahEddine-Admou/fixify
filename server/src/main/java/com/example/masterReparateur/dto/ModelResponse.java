package com.example.masterReparateur.dto;

import com.example.masterReparateur.models.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ModelResponse {

	private Long id;
	private String name;
	private String description;
	private String subCategory;
	private String category;
	private Long subCategoryId;

	public ModelResponse(Model Model) {
		this.id = Model.getId();
		this.name = Model.getName();
		this.description = Model.getDescription();
		this.subCategory = Model.getSubCategoryModel().getName();
		this.category = Model.getSubCategoryModel().getCategoryModel().getName();
		this.subCategoryId = Model.getSubCategoryModel().getId();
	}
}
