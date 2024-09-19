package com.example.masterReparateur.service;

import org.springframework.stereotype.Service;

import com.example.masterReparateur.repository.ReclamationRepo;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ReclamationService {

	private final ReclamationRepo reclamationRepo;

}
