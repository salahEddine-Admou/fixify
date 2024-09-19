package com.example.masterReparateur.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.masterReparateur.service.ClientService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("api/client")
@AllArgsConstructor

public class ClientController {

	private final ClientService clientService;

}
