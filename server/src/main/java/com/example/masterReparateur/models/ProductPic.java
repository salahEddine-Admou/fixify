package com.example.masterReparateur.models;

import javax.persistence.*;

import lombok.Data;

@Entity
@Data
public class ProductPic {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;

	@Column(name = "src", unique = true)
	private String src;

	@ManyToOne
	private Product product;

}
