package com.example.masterReparateur.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.masterReparateur.models.CategoryModel;

import java.util.Optional;

@Repository
public interface CategoryModelRepo extends JpaRepository<CategoryModel, Long> {
	Optional<CategoryModel> findByName(String name);
}
