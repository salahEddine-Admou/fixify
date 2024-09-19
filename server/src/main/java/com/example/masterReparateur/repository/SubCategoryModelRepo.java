package com.example.masterReparateur.repository;

import com.example.masterReparateur.models.CategoryModel;
import com.example.masterReparateur.models.SubCategoryModel;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SubCategoryModelRepo extends JpaRepository<SubCategoryModel, Long> {

	List<SubCategoryModel> findByCategoryModelName(String category);

	@Query("SELECT sc FROM SubCategoryModel sc WHERE sc.name = :name AND sc.categoryModel.id = :categoryId")
	Optional<SubCategoryModel> findByNameAndCategoryModelId(@Param("name") String name,
			@Param("categoryId") Long categoryId);

}
