package com.example.masterReparateur.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
	@NotBlank(message = "L'e-mail est requis")
	@Email(message = "Format d'e-mail invalide")
	private String email;

	private String imageProfile;
	private String firstName;
	private String numero;
	private String address;

	private String lastName;

	private boolean gender;

	@NotBlank(message = "Le nom d'utilisateur est requis")
	@Size(min = 2, max = 30, message = "Le nom d'utilisateur doit contenir entre 3 et 30 caractères")
	private String username;

	@NotBlank(message = "Le mot de passe est requis")
	@Size(min = 6, message = "Le mot de passe doit contenir au moins 6 caractères")
	private String password;

}
