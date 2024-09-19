package com.example.masterReparateur.service;

import java.util.List;
import java.util.Optional;

import com.example.masterReparateur.exception.MasterException;
import com.example.masterReparateur.repository.ReservationRepo;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.example.masterReparateur.models.CategoryModel;
import com.example.masterReparateur.repository.CategoryModelRepo;

@Service
public class CategoryModelService {
	private final CategoryModelRepo categoryModelRepo;
	private final ReservationRepo reservationRepo;

	public CategoryModelService(CategoryModelRepo categoryModelRepo, ReservationRepo reservationRepo) {
		this.categoryModelRepo = categoryModelRepo;
		this.reservationRepo = reservationRepo;
	}

	public List<CategoryModel> getAllCategoryModels() {
		return categoryModelRepo.findAll();
	}

	public CategoryModel getCategoryModelById(Long id) {
		return categoryModelRepo.findById(id).orElse(null);
	}

	public CategoryModel createCategoryModel(CategoryModel categoryModel) {
		return categoryModelRepo.save(categoryModel);
	}

	public CategoryModel updateCategoryModel(Long id, CategoryModel categoryModel) {
		if (categoryModelRepo.existsById(id)) {
			categoryModel.setId(id);
			return categoryModelRepo.save(categoryModel);
		}
		return null;
	}

	public boolean checkAvailable(String name) {
		if (name != "") {
			Optional<CategoryModel> categoryModel = categoryModelRepo.findByName(name);
			return categoryModel.isPresent();
		} else {
			return false;
		}
	}

	public void deleteCategoryModel(Long id) {
		CategoryModel category = categoryModelRepo.findById(id)
				.orElseThrow(() -> new MasterException("Category not found with id " + id, HttpStatus.NOT_FOUND));
		System.out.println(reservationRepo.existsByReparationModelSubCategoryModelCategoryModel(category));
		if (!reservationRepo.existsByReparationModelSubCategoryModelCategoryModel(category)) {
			categoryModelRepo.deleteById(id);
			throw new MasterException("Type de produit supprimer avec succes ", HttpStatus.OK);
		}
		throw new MasterException("Ce type de produit a des réservations, vous ne pouvez pas le supprimer.",
				HttpStatus.NOT_FOUND);

	}
}
