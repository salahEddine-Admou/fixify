package com.example.masterReparateur.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.masterReparateur.models.Reclamation;
import com.example.masterReparateur.service.ReclamationService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/reclamations")
@AllArgsConstructor
public class ReclamationController {

	private final ReclamationService reclamationService;

}
