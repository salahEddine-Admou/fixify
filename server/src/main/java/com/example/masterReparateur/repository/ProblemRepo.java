package com.example.masterReparateur.repository;

import java.util.Optional;
import java.util.List;

import com.example.masterReparateur.models.SubCategoryModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.masterReparateur.models.CategoryModel;
import com.example.masterReparateur.models.Problem;

@Repository
public interface ProblemRepo extends JpaRepository<Problem, Long> {
	Optional<List<Problem>> findByCategoryModel(CategoryModel categoryModel);

	@Query("SELECT p FROM Problem p WHERE p.name = :name AND p.categoryModel.id = :categoryId")
	Optional<Problem> findByNameAndCategoryModelId(@Param("name") String name, @Param("categoryId") Long categoryId);

	Optional<Problem> findByName(String problemName);

	Optional<Problem> findByNameAndCategoryModelName(String problemName, String categoryName);

}
