package com.example.masterReparateur.models;

import javax.persistence.*;
import lombok.Data;

@Entity
@Data
public class SupportTechnique extends User {
	@Column(name = "imageprofile")
	private String imageProfile;
}
