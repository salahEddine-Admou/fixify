package com.example.masterReparateur.dto;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;

import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.masterReparateur.models.Livreur;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class LivreurRequest {
	private String cin;

	private String imageProfile;

	private List<String> imageIdentity = new ArrayList<>();
	private String rib;

	private String username;

	private String firstName;

	private String lastName;

	private boolean gender;

	private String address;

	private String city;

	private String email;

	private String password;

	private String phone;

}
