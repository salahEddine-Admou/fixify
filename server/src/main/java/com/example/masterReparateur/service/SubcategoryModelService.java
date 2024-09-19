package com.example.masterReparateur.service;

import com.example.masterReparateur.dto.SubCategoryResponse;
import com.example.masterReparateur.models.CategoryModel;
import com.example.masterReparateur.models.Repairer;
import com.example.masterReparateur.repository.CategoryModelRepo;
import com.example.masterReparateur.repository.ReservationRepo;
import org.springframework.stereotype.Service;

import com.example.masterReparateur.repository.SubCategoryModelRepo;
import com.example.masterReparateur.dto.SubCategoryDto;
import com.example.masterReparateur.exception.MasterException;
import com.example.masterReparateur.models.SubCategoryModel;
import com.example.masterReparateur.repository.SubCategoryModelRepo;

import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class SubcategoryModelService {
	private final SubCategoryModelRepo subCategoryRepo;
	private final CategoryModelRepo categoryModelRepo;
	private final ReservationRepo reservationRepo;

	public List<SubCategoryResponse> getAllSubCategories() {
		List<SubCategoryModel> subCategories$ = subCategoryRepo.findAll();
		List<SubCategoryResponse> subCategories = subCategories$.stream().map(this::mapToDto)
				.collect(Collectors.toList());
		return subCategories;
	}

	public SubCategoryModel getSubCategoryById(Long id) {
		Optional<SubCategoryModel> optionalSubCategory = subCategoryRepo.findById(id);
		if (optionalSubCategory.isPresent()) {
			return optionalSubCategory.get();
		} else {
			throw new MasterException("Sous-catégorie introuvable", HttpStatus.NOT_FOUND);
		}
	}

	public SubCategoryResponse createSubCategory(SubCategoryDto subCategoryRequest) {
		try {
			CategoryModel categoryModel = categoryModelRepo.findById(subCategoryRequest.getCategoryId()).get();
			SubCategoryModel subCategory = new SubCategoryModel(subCategoryRequest);
			subCategory.setCategoryModel(categoryModel);
			subCategory = subCategoryRepo.save(subCategory);
			return new SubCategoryResponse(subCategory);
		} catch (Exception e) {
			throw new MasterException("Erreur lors de la création de la sous-catégorie",
					HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public SubCategoryResponse updateSubCategory(Long id, SubCategoryDto subCategory) {
		Optional<SubCategoryModel> optionalSubCategory = subCategoryRepo.findById(id);
		CategoryModel categoryModel = categoryModelRepo.findById(subCategory.getCategoryId()).get();
		if (optionalSubCategory.isPresent()) {
			SubCategoryModel existingSubCategory = optionalSubCategory.get();
			existingSubCategory.setName(subCategory.getName());
			existingSubCategory.setDescription(subCategory.getDescription());
			existingSubCategory.setCategoryModel(categoryModel);
			existingSubCategory = subCategoryRepo.save(existingSubCategory);
			return new SubCategoryResponse(existingSubCategory);
		} else {
			throw new MasterException("Sous-catégorie introuvable", HttpStatus.NOT_FOUND);
		}
	}

	public void deleteSubCategory(Long id) {
		SubCategoryModel subCategoryModel = subCategoryRepo.findById(id)
				.orElseThrow(() -> new MasterException("Marque not found with id ", HttpStatus.NOT_FOUND));
		if (!reservationRepo.existsByReparationModelSubCategoryModel(subCategoryModel)) {
			subCategoryRepo.deleteById(id);
			throw new MasterException("Marque supprimer avec succes ", HttpStatus.OK);
		}
		throw new MasterException("Cette marque a des réservations, vous ne pouvez pas le supprimer.",
				HttpStatus.NOT_FOUND);
	}

	public List<SubCategoryResponse> getSubCategoriesByCategory(String category) {
		List<SubCategoryModel> subCategories = subCategoryRepo.findByCategoryModelName(category);
		return subCategories.stream().map(this::mapToDto).collect(Collectors.toList());
	}

	public SubCategoryResponse mapToDto(SubCategoryModel subCategory) {
		return new SubCategoryResponse(subCategory);
	}

	public boolean checkAvailable(Long id, String name) {
		if (name != "" && id != null) {
			Optional<SubCategoryModel> subCategoryModel = subCategoryRepo.findByNameAndCategoryModelId(name, id);
			return subCategoryModel.isPresent();
		} else {
			return false;
		}
	}

}
