package com.example.masterReparateur.dto;

import com.example.masterReparateur.models.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserDto {
	private Long id;
	private String username;
	private String firstName;
	private String lastName;
	private boolean gender;
	private String address;
	private String city;
	private String email;
	private String profilePic;
	private boolean emailVerified;
	private boolean active;
	private Role role;

}
