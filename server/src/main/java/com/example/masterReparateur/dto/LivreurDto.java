package com.example.masterReparateur.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LivreurDto extends UserDto {
	private String cin;
	private String rib;
	private String imageProfile;
	private String imageIdentity;
	private String description;

	public LivreurDto() {
	}
}
