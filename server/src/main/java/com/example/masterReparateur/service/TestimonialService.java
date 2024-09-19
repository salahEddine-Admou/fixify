package com.example.masterReparateur.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.masterReparateur.models.Testimonial;
import com.example.masterReparateur.repository.TestimonialRepo;

import java.util.List;

@Service
public class TestimonialService {
	@Autowired
	private TestimonialRepo testimonialRepo;

	public Testimonial addTestimonial(Testimonial testimonial) {
		return testimonialRepo.save(testimonial);
	}

	public List<Testimonial> getAllTestimonials() {
		return testimonialRepo.findAll();
	}

	public Optional<Testimonial> getTestimonialById(Long id) {
		return testimonialRepo.findById(id);
	}

	public Testimonial createTestimonial(Testimonial testimonial) {
		return testimonialRepo.save(testimonial);
	}

	public Testimonial updateTestimonial(Testimonial testimonial) {
		return testimonialRepo.save(testimonial);
	}

	public void deleteTestimonial(Long id) {
		testimonialRepo.deleteById(id);
	}
}
