package com.example.masterReparateur.dto;

import com.example.masterReparateur.models.CategoryModel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SubCategoryDto {
	private String name;
	private String description;
	private Long categoryId;
}
