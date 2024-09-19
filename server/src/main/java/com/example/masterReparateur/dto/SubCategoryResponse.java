package com.example.masterReparateur.dto;

import com.example.masterReparateur.models.SubCategoryModel;
import lombok.Data;

@Data
public class SubCategoryResponse {

	private Long id;
	private String name;
	private String description;
	private String category;
	private Long categoryId;

	public SubCategoryResponse(SubCategoryModel subCategoryModel) {
		this.id = subCategoryModel.getId();
		this.name = subCategoryModel.getName();
		this.description = subCategoryModel.getDescription();
		this.category = subCategoryModel.getCategoryModel().getName();
		this.categoryId = subCategoryModel.getCategoryModel().getId();
	}
}
