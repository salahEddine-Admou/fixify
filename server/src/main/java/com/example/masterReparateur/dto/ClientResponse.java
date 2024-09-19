package com.example.masterReparateur.dto;

import com.example.masterReparateur.models.Client;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClientResponse extends UserDto {
	private int totalReservations;
	private int totalReclamations;
	private int totalOrders;
	private String imageProfile;
	private String phone;

	public ClientResponse(Client client) {
		super(client.getId(), client.getUsername(), client.getFirstName(), client.getLastName(), client.isGender(),
				client.getAddress(), client.getCity(), client.getEmail(), client.getProfilePic(),
				client.isEmailVerified(), client.isActive(), client.getRole());

		this.totalReservations = (client.getReservations() != null) ? client.getReservations().size() : 0;
		this.totalReclamations = (client.getReclamations() != null) ? client.getReclamations().size() : 0;
		this.totalOrders = (client.getOrders() != null) ? client.getOrders().size() : 0;
		this.imageProfile = client.getImageProfile();
		this.phone = client.getPhone();

	}
}
