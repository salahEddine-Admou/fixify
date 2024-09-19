package com.example.masterReparateur.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.masterReparateur.service.LivreurService;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/api/livreur")

public class LivreurModelController {

	private final LivreurService livreurService;
}
