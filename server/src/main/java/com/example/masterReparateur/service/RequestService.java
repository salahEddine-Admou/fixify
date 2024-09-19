package com.example.masterReparateur.service;

import java.time.LocalDateTime;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.example.masterReparateur.dto.RequestResponse;
import com.example.masterReparateur.exception.MasterException;
import com.example.masterReparateur.models.Admin;
import com.example.masterReparateur.models.Livreur;
import com.example.masterReparateur.models.NotificationEmail;
import com.example.masterReparateur.models.Repairer;
import com.example.masterReparateur.models.Reparation;
import com.example.masterReparateur.models.Request;
import com.example.masterReparateur.models.Reservation;
import com.example.masterReparateur.models.SupportTechnique;
import com.example.masterReparateur.repository.AdminRepo;
import com.example.masterReparateur.repository.LivreurRepo;
import com.example.masterReparateur.repository.RepairerRepo;
import com.example.masterReparateur.repository.ReparationRepo;
import com.example.masterReparateur.repository.RequestRepo;
import com.example.masterReparateur.repository.ReservationRepo;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class RequestService {
	private final RequestRepo requestRepo;
	private final RepairerRepo repairerRepo;
	private final ReservationRepo reservationRepo;
	private final LivreurRepo livreurRepo;
	private final AdminRepo adminRepo;
	private final MailService mailService;
	private final ReparationRepo reparationRepo;

	public RequestResponse getNewRequestDetail(Long id) {
		Request request = requestRepo.findById(id)
				.orElseThrow(() -> new MasterException("Cette demande est deja regle", HttpStatus.NOT_FOUND));
		return mapToDto(request);
	}

	private RequestResponse mapToDto(Request request) {
		List<Repairer> repairers = repairerRepo.getReapairersByModelAndProblemTypeAndCity(request.getModel().getId(),
				request.getProblem().getId(), request.getClient().getCity());

		return new RequestResponse(request, repairers);

	}

	@Transactional
	public void changeRepairer(Long id, Long reqId, Long oldId) {
		LocalDateTime currentDateTime = LocalDateTime.now();
		Repairer newRepairer = repairerRepo.findById(id).get();
		Repairer oldRepairer = repairerRepo.findById(oldId).get();
		Request request = requestRepo.findById(reqId).get();

		Reparation reparation = reparationRepo.findByModelIdAndProblemIdAndRepairerUsername(request.getModel().getId(),
				request.getProblem().getId(), newRepairer.getUsername()).get();

		Reservation reservation = new Reservation();
		reservation.setReparation(reparation);
		reservation.setClient(request.getClient());
		reservation.setDescription("desc");
		reservation.setDate(currentDateTime);
		reservation.setOldRepairer(oldRepairer);
		requestRepo.deleteById(reqId);
		reservation = reservationRepo.save(reservation);
		sendEmails(request.getClient().getEmail(), newRepairer.getEmail(), reservation);

	}

	@Async
	private void sendEmails(String clientEmail, String repairerEmail, Reservation reservation) {
		List<Livreur> livreurs = livreurRepo.findLivreursWithNoStatusZeroDeliveries(reservation.getClient().getCity());
		List<Admin> supportTechniques = adminRepo.findAll();
		for (Livreur livreur : livreurs) {
			mailService.sendMail(new NotificationEmail("Nouvelle reservation a livrer", livreur.getEmail(),
					"Une nouvelle reservaton pour vous a livrer : http://localhost:3000/front/new-reservation/"
							+ reservation.getId() + "?reservtype=from-rep-to-rep"));
		}
		for (Admin supportTechnique : supportTechniques) {
			mailService.sendMail(
					new NotificationEmail("Nouvelle reservation est met en place", supportTechnique.getEmail(),
							"Une nouvelle reservaton est met en place : http://localhost:3000/front/new-reservation/"
									+ reservation.getId()));
		}
		mailService.sendMail(new NotificationEmail("Nouvelle reservation pour vous", repairerEmail,
				"Une nouvelle reservaton pour vous : http://localhost:3000/front/new-reservation/"
						+ reservation.getId()));

		mailService.sendMail(new NotificationEmail("Votre reservation est affecte  a un autre reparateur ", clientEmail,
				"Votre reservation est affecte  a un autre reparateur : http://localhost:3000/front/new-reservation/"
						+ reservation.getId()));
	}

}
