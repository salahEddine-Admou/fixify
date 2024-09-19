package com.example.masterReparateur.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.masterReparateur.dto.CategoryModelDto;
import com.example.masterReparateur.exception.MasterException;
import com.example.masterReparateur.models.CategoryModel;
import com.example.masterReparateur.service.CategoryModelService;

@RestController
@RequestMapping("/api/categorymodel")

public class CategoryModelController {
	private final CategoryModelService categoryModelService;

	public CategoryModelController(CategoryModelService categoryModelService) {
		this.categoryModelService = categoryModelService;
	}

	@GetMapping
	public ResponseEntity<List<CategoryModelDto>> getAllCategoryModels() {
		List<CategoryModel> categoryModels = categoryModelService.getAllCategoryModels();
		List<CategoryModelDto> categoryModelDtos = categoryModels.stream().map(this::convertToDto)
				.collect(Collectors.toList());
		return ResponseEntity.ok(categoryModelDtos);
	}

	@GetMapping("/{id}")
	public ResponseEntity<CategoryModelDto> getCategoryModelById(@PathVariable Long id) {
		CategoryModel categoryModel = categoryModelService.getCategoryModelById(id);
		if (categoryModel != null) {
			CategoryModelDto categoryModelDto = convertToDto(categoryModel);
			return ResponseEntity.ok(categoryModelDto);
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	@PostMapping
	public ResponseEntity<CategoryModelDto> createCategoryModel(@RequestBody CategoryModelDto categoryModelDto) {
		CategoryModel categoryModel = convertToEntity(categoryModelDto);
		CategoryModel createdCategoryModel = categoryModelService.createCategoryModel(categoryModel);
		CategoryModelDto createdCategoryModelDto = convertToDto(createdCategoryModel);
		return new ResponseEntity<>(createdCategoryModelDto, HttpStatus.CREATED);
	}

	@PutMapping("/{id}")
	public ResponseEntity<CategoryModelDto> updateCategoryModel(@PathVariable Long id,
			@RequestBody CategoryModelDto categoryModelDto) {
		CategoryModel categoryModel = convertToEntity(categoryModelDto);
		CategoryModel updatedCategoryModel = categoryModelService.updateCategoryModel(id, categoryModel);
		if (updatedCategoryModel != null) {
			CategoryModelDto updatedCategoryModelDto = convertToDto(updatedCategoryModel);
			return ResponseEntity.ok(updatedCategoryModelDto);
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteCategoryModel(@PathVariable Long id) {
		categoryModelService.deleteCategoryModel(id);
		return ResponseEntity.noContent().build();
	}

	private CategoryModelDto convertToDto(CategoryModel categoryModel) {
		CategoryModelDto categoryModelDto = new CategoryModelDto();
		categoryModelDto.setId(categoryModel.getId());
		categoryModelDto.setName(categoryModel.getName());
		categoryModelDto.setDescription(categoryModel.getDescription());
		return categoryModelDto;
	}

	private CategoryModel convertToEntity(CategoryModelDto categoryModelDto) {
		CategoryModel categoryModel = new CategoryModel();
		categoryModel.setId(categoryModelDto.getId());
		categoryModel.setName(categoryModelDto.getName());
		categoryModel.setDescription(categoryModelDto.getDescription());
		return categoryModel;
	}

	@PostMapping("/check-available")
	public ResponseEntity<String> checkAvailable(@RequestBody CategoryModel categoryModel) {
		if (categoryModelService.checkAvailable(categoryModel.getName()))
			throw new MasterException("Category exists", HttpStatus.FOUND);
		else
			return ResponseEntity.ok("okay");
	}
}
