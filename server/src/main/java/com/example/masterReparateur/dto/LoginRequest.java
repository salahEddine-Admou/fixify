package com.example.masterReparateur.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {

	@NotEmpty(message = "Le nom d'utilisateur est requis.")
	private String username;
	@NotBlank(message = "Le mot de passe est requis")
	private String password;
}
