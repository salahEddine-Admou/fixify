package com.example.masterReparateur.service;

import org.springframework.stereotype.Service;

import com.example.masterReparateur.repository.CategoryProductRepo;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class CategoryProductService {
	private final CategoryProductRepo categoryProductRepo;

}
