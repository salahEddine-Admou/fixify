package com.example.masterReparateur.controller;

import com.example.masterReparateur.dto.ReviewDto;
import com.example.masterReparateur.dto.SubCategoryResponse;
import com.example.masterReparateur.exception.MasterException;
import com.example.masterReparateur.models.Review;
import com.example.masterReparateur.models.SubCategoryModel;
import com.example.masterReparateur.service.ReviewService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/review")
@AllArgsConstructor
public class ReviewController {

	private final ReviewService reviewService;

	@GetMapping
	public ResponseEntity<List<Review>> getAllReviews() {
		List<Review> reviews = reviewService.getAllReviews();
		return new ResponseEntity<>(reviews, HttpStatus.OK);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Review> getReviewById(@PathVariable Long id) {
		Review review = reviewService.getReviewById(id);
		return new ResponseEntity<>(review, review != null ? HttpStatus.OK : HttpStatus.NOT_FOUND);
	}

	@PostMapping
	public ResponseEntity<String> createReview(@RequestBody ReviewDto reviewDto) {
		Review review = reviewService.saveReview(reviewDto);
		return ResponseEntity.status(HttpStatus.OK).body("Review ajouter avec succes");
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
		reviewService.deleteReview(id);
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}
}
