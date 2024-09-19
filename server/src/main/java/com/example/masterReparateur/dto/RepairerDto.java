package com.example.masterReparateur.dto;

import java.util.ArrayList;
import java.util.List;

import com.example.masterReparateur.models.CinPhoto;
import com.example.masterReparateur.models.Portfolio;
import com.example.masterReparateur.models.Repairer;
import com.example.masterReparateur.models.Review;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RepairerDto extends UserDto {
	private String cin;
	private String rib;
	private String imageProfile;
	private List<String> imageIdentity = new ArrayList<>();
	private List<String> imagePortfolio = new ArrayList<>();
	private String description;
	private boolean isPro;
	private List<Review> reviews;
	private String password;
	private String phone;

	public RepairerDto() {
	}

	public RepairerDto(Repairer repairer) {
		super(repairer.getId(), repairer.getUsername(), repairer.getFirstName(), repairer.getLastName(),
				repairer.isGender(), repairer.getAddress(), repairer.getCity(), repairer.getEmail(),
				repairer.getProfilePic(), repairer.isEmailVerified(), repairer.isActive(), repairer.getRole());
		this.cin = repairer.getCin();
		this.rib = repairer.getRib();
		this.imageProfile = repairer.getImageProfile();
		this.description = repairer.getDescription();
		this.reviews = repairer.getReviews();
		this.isPro = repairer.isPro();
		this.password = repairer.getPassword();
		this.phone = repairer.getPhone();
	}
}
