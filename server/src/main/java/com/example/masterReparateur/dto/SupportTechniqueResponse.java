package com.example.masterReparateur.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class SupportTechniqueResponse extends UserDto {
	private String password;
	private String imageProfile;

	public SupportTechniqueResponse() {
	}

}
