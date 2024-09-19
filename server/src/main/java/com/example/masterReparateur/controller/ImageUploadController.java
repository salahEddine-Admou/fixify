package com.example.masterReparateur.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.masterReparateur.exception.MasterException;
import com.example.masterReparateur.models.CinPhoto;
import com.example.masterReparateur.models.ImageReservation;
import com.example.masterReparateur.models.Portfolio;
import com.example.masterReparateur.models.Repairer;
import com.example.masterReparateur.repository.CinPhotoRepo;

import com.example.masterReparateur.repository.ImageReservationRepo;
import com.example.masterReparateur.repository.PortfolioRepo;

import com.example.masterReparateur.repository.RepairerRepo;
import com.example.masterReparateur.service.RepairerService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")

public class ImageUploadController {

	private final CinPhotoRepo cinPhotoRepo;
	private final PortfolioRepo portfolioRepo;
	private final RepairerRepo repairerRepo;
	private final ImageReservationRepo imageReservationRepo;

	public ImageUploadController(CinPhotoRepo cinPhotoRepo, PortfolioRepo portfolioRepo, RepairerRepo repairerRepo,
			RepairerService repairerService, ImageReservationRepo imageReservationRepo) {
		this.cinPhotoRepo = cinPhotoRepo;
		this.portfolioRepo = portfolioRepo;
		this.repairerRepo = repairerRepo;
		this.imageReservationRepo = imageReservationRepo;

	}

	@Value("${cloudinary.cloud_name}")
	private String cloudName;

	@Value("${cloudinary.api_key}")
	private String apiKey;

	@Value("${cloudinary.api_secret}")
	private String apiSecret;

	@PostMapping("/auth/upload")
	public Map<?, ?> uploadImage(@RequestParam("file") MultipartFile file) throws IOException {
		Cloudinary cloudinary = new Cloudinary(
				ObjectUtils.asMap("cloud_name", cloudName, "api_key", apiKey, "api_secret", apiSecret));

		Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
		return Map.of("imageUrl", uploadResult.get("secure_url"));
	}

	@PostMapping("/auth/cin/upload")
	public Map<?, ?> uploadCinImage(@RequestParam("file") MultipartFile file) throws IOException {
		Cloudinary cloudinary = new Cloudinary(
				ObjectUtils.asMap("cloud_name", cloudName, "api_key", apiKey, "api_secret", apiSecret));

		Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());

		CinPhoto cinPhoto = new CinPhoto();
		String imgSrc = uploadResult.get("secure_url").toString();
		cinPhoto.setSrc(imgSrc);
		cinPhotoRepo.save(cinPhoto);

		return Map.of("imageUrl", uploadResult.get("secure_url"));
	}

	@PostMapping("/auth/portfolio/upload")
	public Map<String, String> uploadPortfolioPhoto(@RequestParam("file") MultipartFile file) throws IOException {
		// Optional<Repairer> optionalRepairer = repairerRepo.findById(repairerId);

		/*
		 * if (optionalRepairer.isPresent()) { Repairer repairer =
		 * optionalRepairer.get();
		 */

		Cloudinary cloudinary = new Cloudinary(
				ObjectUtils.asMap("cloud_name", cloudName, "api_key", apiKey, "api_secret", apiSecret));

		Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());

		Portfolio portfolioPhoto = new Portfolio();
		String imgSrc = uploadResult.get("secure_url").toString();
		portfolioPhoto.setSrc(imgSrc);
		// portfolioPhoto.setRepairer(repairer);
		portfolioRepo.save(portfolioPhoto);

		return Map.of("imageUrl", imgSrc);
		/*
		 * } else {
		 * 
		 * return Map.of("error", "Réparateur non trouvé avec l'ID spécifié."); }
		 */
	}

	@PostMapping("/auth/imgReservation/upload")
	public Map<String, String> uploadImageReservation(@RequestParam("file") MultipartFile file) throws IOException {
		Cloudinary cloudinary = new Cloudinary(
				ObjectUtils.asMap("cloud_name", cloudName, "api_key", apiKey, "api_secret", apiSecret));
		Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
		ImageReservation imageReservation = new ImageReservation();
		String imgSrc = uploadResult.get("secure_url").toString();
		imageReservation.setSrc(imgSrc);
		imageReservationRepo.save(imageReservation);
		return Map.of("imageUrl", imgSrc);
	}
}
