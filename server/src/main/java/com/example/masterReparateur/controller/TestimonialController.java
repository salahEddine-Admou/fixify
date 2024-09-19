package com.example.masterReparateur.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.masterReparateur.models.Testimonial;
import com.example.masterReparateur.service.TestimonialService;

import lombok.AllArgsConstructor;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/testimonials")
@AllArgsConstructor
public class TestimonialController {

	@Autowired
	private TestimonialService testimonialService;

	@GetMapping
	public List<Testimonial> getAllTestimonials() {
		return testimonialService.getAllTestimonials();
	}

	@GetMapping("/{id}")
	public ResponseEntity<Testimonial> getTestimonialById(@PathVariable Long id) {
		Optional<Testimonial> testimonial = testimonialService.getTestimonialById(id);
		return testimonial.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
				.orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	@PostMapping
	public ResponseEntity<Testimonial> createTestimonial(@RequestBody Testimonial testimonial) {
		Testimonial createdTestimonial = testimonialService.createTestimonial(testimonial);
		return new ResponseEntity<>(createdTestimonial, HttpStatus.CREATED);
	}

	@PutMapping("/{id}")
	public ResponseEntity<Testimonial> updateTestimonial(@PathVariable Long id, @RequestBody Testimonial testimonial) {
		Optional<Testimonial> existingTestimonial = testimonialService.getTestimonialById(id);
		if (existingTestimonial.isPresent()) {
			testimonial.setId(id);
			Testimonial updatedTestimonial = testimonialService.updateTestimonial(testimonial); // Correction ici
			return new ResponseEntity<>(updatedTestimonial, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteTestimonial(@PathVariable Long id) {
		Optional<Testimonial> existingTestimonial = testimonialService.getTestimonialById(id);
		if (existingTestimonial.isPresent()) {
			testimonialService.deleteTestimonial(id);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
}
