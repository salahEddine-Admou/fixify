package com.example.masterReparateur.service;

import com.example.masterReparateur.dto.LivreurDto;
import com.example.masterReparateur.exception.MasterException;
import com.example.masterReparateur.models.*;
import com.example.masterReparateur.repository.DeliveryRepo;
import com.example.masterReparateur.repository.LivreurRepo;
import com.example.masterReparateur.repository.ReservationRepo;

import lombok.AllArgsConstructor;
import net.bytebuddy.implementation.bytecode.Throw;

import java.util.*;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class LivreurService {
	private final LivreurRepo livreurRepo;
	private final ReservationRepo reservationRepo;
	private final AuthService authService;
	private final MailService mailService;
	private DeliveryRepo deliveryRepo;

	public List<LivreurDto> getAllLivreurs() {
		List<Livreur> livreurs = livreurRepo.findAll();
		return livreurs.stream().map(this::convertToDto).collect(Collectors.toList());
	}

	public LivreurDto getLivreurById(Long id) {
		Optional<Livreur> optionalLivreur = livreurRepo.findById(id);
		if (optionalLivreur.isPresent()) {
			return convertToDto(optionalLivreur.get());
		} else {
			throw new MasterException("Livreur introuvable", HttpStatus.NOT_FOUND);
		}
	}

	public LivreurDto createLivreur(LivreurDto livreurDTO) {
		livreurDTO.setRole(Role.LIVREUR);
		Livreur livreur = convertToEntity(livreurDTO);
		try {
			Livreur savedLivreur = livreurRepo.save(livreur);
			return convertToDto(savedLivreur);
		} catch (Exception e) {
			throw new MasterException("Erreur lors de la création du livreur", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public LivreurDto updateLivreur(Long id, LivreurDto livreurDTO) {
		Optional<Livreur> optionalLivreur = livreurRepo.findById(id);
		if (optionalLivreur.isPresent()) {
			Livreur existingLivreur = optionalLivreur.get();
			BeanUtils.copyProperties(livreurDTO, existingLivreur);
			Livreur updatedLivreur = livreurRepo.save(existingLivreur);
			return convertToDto(updatedLivreur);
		} else {
			throw new MasterException("Le livreur n'existe pas", HttpStatus.NOT_FOUND);
		}
	}

	public void deleteLivreur(Long id) {
		Optional<Livreur> optionalLivreur = livreurRepo.findById(id);
		if (optionalLivreur.isPresent()) {
			livreurRepo.deleteById(id);
		} else {
			throw new MasterException("Le livreur n'existe pas", HttpStatus.NOT_FOUND);
		}
	}

	private LivreurDto convertToDto(Livreur livreur) {
		LivreurDto livreurDto = new LivreurDto();
		BeanUtils.copyProperties(livreur, livreurDto);
		return livreurDto;
	}

	private Livreur convertToEntity(LivreurDto livreurDTO) {
		Livreur livreur = new Livreur();
		BeanUtils.copyProperties(livreurDTO, livreur);
		return livreur;
	}

	@Transactional
	public void acceptReservation(Long reservationId, String username, String type) {
		Reservation reservation = reservationRepo.findById(reservationId).get();
		Livreur livreur = livreurRepo.findByUsername(username)
				.orElseThrow(() -> new MasterException("Livreur not fund", HttpStatus.NOT_FOUND));

		Delivery delivery = new Delivery();
		if (type.equals("aller")) {
			sendEmail(reservation, "repairer");
			delivery.setDeliveryType(DeliveryType.FromClientToRepairer);

		} else if (type.equals("r2r")) {
			sendEmail(reservation, "repairer");
			delivery.setDeliveryType(DeliveryType.FromRepairerToRepairer);
		}

		else {
			sendEmail(reservation, "client");
			delivery.setDeliveryType(DeliveryType.FromRepairerToClient);
		}

		delivery.setStatus(false);
		delivery.setLivreur(livreur);
		delivery.setReservation(reservation);
		reservation.getDeliveries().add(delivery);
		reservationRepo.save(reservation);

	}

	private void sendEmail(Reservation reservation, String to) {
		if (to.equals("repairer"))
			mailService.sendMail(new NotificationEmail(
					"L'appareil " + reservation.getReparation().getModel().getName() + " est en route",
					reservation.getReparation().getRepairer().getEmail(),
					"Bon courage Monsieur " + reservation.getReparation().getRepairer().getFirstName() + " "
							+ reservation.getReparation().getRepairer().getLastName()));

		else
			mailService.sendMail(new NotificationEmail("Votre appareil est en route",
					reservation.getClient().getEmail(), "Faites-nous part de votre avis Monsieur "
							+ reservation.getClient().getFirstName() + " " + reservation.getClient().getLastName()));

	}

	public void makeDelivrySucces(Long id) {
		Optional<Delivery> optionalDelivery = deliveryRepo.findById(id);
		if (optionalDelivery.isPresent()) {
			Delivery delivery = optionalDelivery.get();
			delivery.setStatus(true);
			deliveryRepo.save(delivery);
		} else {
			throw new MasterException("Delivery introuvable", HttpStatus.NOT_FOUND);
		}
	}

	public void makeDelivryNotSucces(Long id) {
		Optional<Delivery> optionalDelivery = deliveryRepo.findById(id);
		if (optionalDelivery.isPresent()) {
			Delivery delivery = optionalDelivery.get();
			delivery.setStatus(false);
			deliveryRepo.save(delivery);
		} else {
			throw new MasterException("Delivery introuvable", HttpStatus.NOT_FOUND);
		}
	}

	@Transactional
	public void addDeliveryRetour(Long id, String usernameLivreur) {
		Optional<Livreur> optionalLivreur = livreurRepo.findByUsername(usernameLivreur);
		Optional<Reservation> optionalReservation = reservationRepo.findById(id);
		if (optionalLivreur.isPresent() && optionalReservation.isPresent()) {
			Livreur livreur = optionalLivreur.get();
			Reservation reservation = optionalReservation.get();
			Delivery delivery = new Delivery();
			delivery.setDeliveryType(DeliveryType.FromRepairerToClient);
			delivery.setStatus(false);
			delivery.setLivreur(livreur);
			delivery.setReservation(reservation);
			deliveryRepo.save(delivery);
		} else {
			throw new MasterException("Livreur ou Reservation not found", HttpStatus.NOT_FOUND);
		}
	}

	public boolean checkAvailableCin(String cin) {
		if (cin != "") {
			Optional<Livreur> livreur = livreurRepo.findByCin(cin);
			return livreur.isPresent();
		} else {
			return false;
		}
	}

	public boolean checkAvailableRib(String rib) {
		if (rib != "") {
			Optional<Livreur> livreur = livreurRepo.findByRib(rib);
			return livreur.isPresent();
		} else {
			return false;
		}
	}

}
