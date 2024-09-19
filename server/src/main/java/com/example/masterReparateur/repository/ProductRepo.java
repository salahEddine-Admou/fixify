package com.example.masterReparateur.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.masterReparateur.models.Product;

@Repository
public interface ProductRepo extends JpaRepository<Product, Long> {
}
