package com.example.masterReparateur.service;

import com.example.masterReparateur.exception.*;
import com.example.masterReparateur.models.Product;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.example.masterReparateur.repository.ProductRepo;

import lombok.AllArgsConstructor;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ProductService {
	private final ProductRepo productRepo;

	public List<Product> getAllProducts() {
		return productRepo.findAll();
	}

	public Product getProductById(Long id) {
		Optional<Product> optionalProduct = productRepo.findById(id);
		if (optionalProduct.isPresent()) {
			return optionalProduct.get();
		} else {
			throw new MasterException("Produit introuvable", HttpStatus.NOT_FOUND);
		}
	}

	public Product createProduct(Product product) {
		try {
			return productRepo.save(product);
		} catch (Exception e) {
			throw new MasterException("Erreur lors de la création du produit", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public Product updateProduct(Long id, Product product) {
		Optional<Product> optionalProduct = productRepo.findById(id);
		if (optionalProduct.isPresent()) {
			Product existingProduct = optionalProduct.get();
			// Mise à jour des champs nécessaires
			existingProduct.setName(product.getName());
			return productRepo.save(existingProduct);
		} else {
			throw new MasterException("Produit introuvable", HttpStatus.NOT_FOUND);
		}
	}

	public void deleteProduct(Long id) {
		try {
			productRepo.deleteById(id);
		} catch (Exception e) {
			throw new MasterException("Erreur lors de la suppression du produit", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
