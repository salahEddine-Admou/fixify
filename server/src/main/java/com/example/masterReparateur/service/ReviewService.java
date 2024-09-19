package com.example.masterReparateur.service;

import com.example.masterReparateur.dto.ReviewDto;
import com.example.masterReparateur.exception.MasterException;
import com.example.masterReparateur.models.Client;
import com.example.masterReparateur.models.Repairer;
import com.example.masterReparateur.models.Review;
import com.example.masterReparateur.repository.ClientRepo;
import com.example.masterReparateur.repository.RepairerRepo;
import com.example.masterReparateur.repository.ReviewRepo;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ReviewService {

	private ReviewRepo reviewRepository;
	private ClientRepo clientRepo;
	private RepairerRepo repairerRepo;

	public List<Review> getAllReviews() {
		return reviewRepository.findAll();
	}

	public Review getReviewById(Long id) {
		return reviewRepository.findById(id).orElse(null);
	}

	public Review saveReview(ReviewDto reviewDto) {
		Optional<Repairer> optionalRepairer = repairerRepo.findById(reviewDto.getRepairerId());
		Optional<Client> clientOptional = clientRepo.findByUsername(reviewDto.getClient());
		boolean reservationExists = checkReservationExists(reviewDto);
		if (!reservationExists) {
			throw new MasterException("Vous n'avez aucune réservation en cours avec ce réparateur.", HttpStatus.FOUND);
		}
		boolean reviewExists = checkReviewExists(reviewDto);
		if (reviewExists) {
			throw new MasterException("Vous avez déjà laissé un avis pour ce réparateur.", HttpStatus.FOUND);
		}
		if (clientOptional.isPresent() && optionalRepairer.isPresent()) {
			Client client = clientOptional.get();
			Repairer repairer = optionalRepairer.get();
			Review review = new Review();
			review.setRating(reviewDto.getRating());
			review.setContent(reviewDto.getContent());
			review.setClient(client);
			review.setRepairer(repairer);
			return reviewRepository.save(review);
		} else {
			throw new MasterException("Erreur lors de la création de la revue", HttpStatus.NOT_FOUND);
		}
	}

	public boolean checkReservationExists(ReviewDto reviewDto) {
		Optional<Client> clientOptional = clientRepo.findByUsername(reviewDto.getClient());
		Optional<Repairer> optionalRepairer = repairerRepo.findById(reviewDto.getRepairerId());
		if (clientOptional.isPresent() && optionalRepairer.isPresent()) {
			Client client = clientOptional.get();
			Repairer repairer = optionalRepairer.get();
			return reviewRepository.existsReservationByClientIdAndRepairerId(client.getId(), repairer.getId());
		}
		return false;
	}

	public boolean checkReviewExists(ReviewDto reviewDto) {
		Optional<Client> clientOptional = clientRepo.findByUsername(reviewDto.getClient());
		Optional<Repairer> optionalRepairer = repairerRepo.findById(reviewDto.getRepairerId());
		if (clientOptional.isPresent() && optionalRepairer.isPresent()) {
			Client client = clientOptional.get();
			Repairer repairer = optionalRepairer.get();
			return reviewRepository.existsReviewByClientIdAndRepairerId(client.getId(), repairer.getId());
		}
		return false;
	}

	public void deleteReview(Long id) {
		reviewRepository.deleteById(id);
	}
}
