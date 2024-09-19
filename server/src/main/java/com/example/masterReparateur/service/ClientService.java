package com.example.masterReparateur.service;

import org.springframework.stereotype.Service;

import com.example.masterReparateur.repository.ClientRepo;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ClientService {
	private final ClientRepo clientRepo;
}
