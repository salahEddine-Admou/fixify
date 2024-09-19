package com.example.masterReparateur.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.util.Objects;

@Entity
public class Testimonial {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String title;

	@Column(columnDefinition = "TEXT")
	private String description;

	private String fullName;
	private String job;

	// Constructeurs, getters et setters

	public Testimonial() {
	}

	public Testimonial(String title, String description, String fullName, String job) {
		this.title = title;
		this.description = description;
		this.fullName = fullName;
		this.job = job;
	}

	// Getters et Setters
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getJob() {
		return job;
	}

	public void setJob(String job) {
		this.job = job;
	}

	@Override
	public String toString() {
		return "Testimonial{" + "id=" + id + ", title='" + title + '\'' + ", description='" + description + '\''
				+ ", fullName='" + fullName + '\'' + ", job='" + job + '\'' + '}';
	}

	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (o == null || getClass() != o.getClass())
			return false;
		Testimonial that = (Testimonial) o;
		return Objects.equals(id, that.id) && Objects.equals(title, that.title)
				&& Objects.equals(description, that.description) && Objects.equals(fullName, that.fullName)
				&& Objects.equals(job, that.job);
	}

	@Override
	public int hashCode() {
		return Objects.hash(id, title, description, fullName, job);
	}
}
