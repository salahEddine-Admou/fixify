package com.example.masterReparateur.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.masterReparateur.models.CategoryProduct;

@Repository
public interface CategoryProductRepo extends JpaRepository<CategoryProduct, Long> {

}
