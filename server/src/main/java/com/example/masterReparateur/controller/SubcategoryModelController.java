package com.example.masterReparateur.controller;

import com.example.masterReparateur.dto.SubCategoryDto;
import com.example.masterReparateur.dto.SubCategoryResponse;
import com.example.masterReparateur.exception.MasterException;
import com.example.masterReparateur.models.CategoryModel;
import com.example.masterReparateur.models.SubCategoryModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.masterReparateur.service.SubcategoryModelService;

import lombok.AllArgsConstructor;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/subcategorymodel")
@AllArgsConstructor
public class SubcategoryModelController {

	private final SubcategoryModelService subCategoryService;

	@GetMapping
	public ResponseEntity<List<SubCategoryResponse>> getAllSubCategories() {
		List<SubCategoryResponse> subCategories = subCategoryService.getAllSubCategories();
		return new ResponseEntity<>(subCategories, HttpStatus.OK);
	}

	@GetMapping("/{id}")
	public ResponseEntity<SubCategoryModel> getSubCategoryById(@PathVariable Long id) {
		SubCategoryModel subCategory = subCategoryService.getSubCategoryById(id);
		return new ResponseEntity<>(subCategory, subCategory != null ? HttpStatus.OK : HttpStatus.NOT_FOUND);
	}

	@PostMapping
	public ResponseEntity<SubCategoryResponse> createSubCategory(@RequestBody SubCategoryDto subCategory) {
		SubCategoryResponse createdSubCategory = subCategoryService.createSubCategory(subCategory);
		return new ResponseEntity<>(createdSubCategory, HttpStatus.CREATED);
	}

	@PutMapping("/{id}")
	public ResponseEntity<SubCategoryResponse> updateSubCategory(@PathVariable Long id,
			@RequestBody SubCategoryDto subCategory) {
		SubCategoryResponse updatedSubCategory = subCategoryService.updateSubCategory(id, subCategory);
		return new ResponseEntity<>(updatedSubCategory,
				updatedSubCategory != null ? HttpStatus.OK : HttpStatus.NOT_FOUND);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteSubCategory(@PathVariable Long id) {
		subCategoryService.deleteSubCategory(id);
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}

	@GetMapping("/category/{category}")
	public ResponseEntity<List<SubCategoryResponse>> getSubCategoriesByCategory(@PathVariable String category) {
		List<SubCategoryResponse> subCategories = subCategoryService.getSubCategoriesByCategory(category);
		return new ResponseEntity<>(subCategories, HttpStatus.OK);
	}

	@PostMapping("/check-available/{id}")
	public ResponseEntity<String> checkAvailable(@PathVariable Long id,
			@RequestBody SubCategoryModel subCategoryModel) {
		if (subCategoryService.checkAvailable(id, subCategoryModel.getName()))
			throw new MasterException("Marque exists", HttpStatus.FOUND);
		else
			return ResponseEntity.ok("okay");
	}

}
