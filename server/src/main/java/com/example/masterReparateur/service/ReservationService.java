package com.example.masterReparateur.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import com.example.masterReparateur.dto.*;
import com.example.masterReparateur.exception.MasterException;
import com.example.masterReparateur.models.*;
import com.example.masterReparateur.repository.*;

import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ReservationService {

	private final RepairerRepo repairerRepo;
	private final ClientRepo clientRepo;
	private final ReparationRepo reparationRepo;
	private final ReservationRepo reservationRepo;
	private final LivreurRepo livreurRepo;
	private final SupportTechniqueRepo supportTechniqueRepo;
	private final MailService mailService;
	private final InvoiceRepo invoiceRepo;
	private final ImageReservationRepo imageReservationRepo;
	private final ModelRepo modelRepo;
	private final ProblemRepo problemRepo;
	private final RequestRepo requestRepo;
	private final AdminRepo adminRepo;
	private final DeliveryRepo deliveryRepo;
	private final CategoryModelRepo categoryModelRepo;
	private static final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

	public Reservation create(ReservationRequest reservationRequest) {

		LocalDateTime currentDateTime = LocalDateTime.now();

		Model model = modelRepo.findById(reservationRequest.getModelId()).get();
		Problem problem = problemRepo.findById(reservationRequest.getProblemId()).get();
		Repairer repairer = repairerRepo.findById(reservationRequest.getRepairerId()).get();

		repairerRepo.findById(reservationRequest.getRepairerId()).get();
		Reparation reparation = reparationRepo
				.findByModelIdAndProblemIdAndRepairerUsername(model.getId(), problem.getId(), repairer.getUsername())
				.get();
		Client client = clientRepo.findByUsername(reservationRequest.getUsername()).get();

		Reservation reservation = new Reservation();
		reservation.setReparation(reparation);
		reservation.setClient(client);
		reservation.setDescription(reservationRequest.getDescription());
		reservation.setDate(currentDateTime);
		reservation = reservationRepo.save(reservation);
		if (!reservationRequest.getImgReservations().isEmpty()) {
			for (String img : reservationRequest.getImgReservations()) {
				Optional<ImageReservation> optionalImgReservation = imageReservationRepo.findBySrc(img);
				if (optionalImgReservation.isPresent()) {
					ImageReservation imageReservation = optionalImgReservation.get();
					imageReservation.setReservation(reservation);
					imageReservationRepo.save(imageReservation);
				}
			}
		}
		sendEmails(client.getEmail(), repairer.getEmail(), reservation);

		return reservation;

	}

	@Async
	private void sendEmails(String clientEmail, String repairerEmail, Reservation reservation) {
		List<Livreur> livreurs = livreurRepo.findLivreursWithNoStatusZeroDeliveries(reservation.getClient().getCity());
		List<SupportTechnique> supportTechniques = supportTechniqueRepo.findAll();
		for (Livreur livreur : livreurs) {
			mailService.sendMail(new NotificationEmail("Nouvelle reservation à livrer", livreur.getEmail(),
					"Une nouvelle reservation pour vous à livrer  : http://localhost:3000/front/new-reservation/"
							+ reservation.getId()));
		}
		for (SupportTechnique supportTechnique : supportTechniques) {
			mailService.sendMail(
					new NotificationEmail("Nouvelle reservation est mise en place", supportTechnique.getEmail(),
							"Une nouvelle reservation est mise en place: http://localhost:3000/front/new-reservation/"
									+ reservation.getId()));
		}
		mailService.sendMail(new NotificationEmail("Nouvelle reservation pour vous", repairerEmail,
				"Une nouvelle reservation pour vous: http://localhost:3000/front/new-reservation/"
						+ reservation.getId()));

		mailService.sendMail(new NotificationEmail("Accusé de reservation", clientEmail,
				"Votre reservation a été créée avec succès: http://localhost:3000/front/new-reservation/"
						+ reservation.getId()));
	}

	public List<ReservationResponse> getAllReservations() {
		List<Reservation> reservations = reservationRepo.findAll();
		List<ReservationResponse> reservationResponses = reservations.stream()
				.sorted(Comparator.comparingLong(Reservation::getId).reversed()).map(this::mapToDto)
				.collect(Collectors.toList());
		return reservationResponses;
	}

	private ReservationResponse mapToDto(Reservation reservation) {
		return new ReservationResponse(reservation);
	}

	private ClientReservationResponse mapToClientReservDto(Reservation reservation) {
		ClientReservationResponse clientReservationResponse = new ClientReservationResponse(reservation);
		List<Delivery> deliveries = deliveryRepo.findAllByReservation(reservation).stream()
				.sorted(Comparator.comparingLong(Delivery::getId).reversed()).collect(Collectors.toList());
		if (deliveries.size() > 0) {
			for (Delivery delivery : deliveries) {
				if (delivery.getDeliveryType().equals(DeliveryType.FromRepairerToClient) && delivery.isStatus()) {
					clientReservationResponse.setTrackStatus("Arrive au client");
					return clientReservationResponse;
				} else if (delivery.getDeliveryType().equals(DeliveryType.FromRepairerToClient)
						&& !delivery.isStatus()) {
					clientReservationResponse.setTrackStatus(" En route vers vous");
					return clientReservationResponse;
				} else if (delivery.getDeliveryType().equals(DeliveryType.FromClientToRepairer)
						&& delivery.isStatus()) {
					clientReservationResponse.setTrackStatus("Arrive au reparateur");
				} else if (delivery.getDeliveryType().equals(DeliveryType.FromClientToRepairer)
						&& !delivery.isStatus()) {
					clientReservationResponse.setTrackStatus("En route vers le reparateur");
				} else {
					clientReservationResponse.setTrackStatus("En cours");
				}

			}
		} else {
			clientReservationResponse.setTrackStatus("Arrive au client");
		}

		return clientReservationResponse;

	}

	public List<ReservationResponse> getNewReservations() {
		return reservationRepo.findReservationsWithZeroDeliveries().stream().map(this::mapToDto)
				.collect(Collectors.toList());

	}

	public ReservationResponse getNewReservationDetail(Long id) {
		Reservation reservation = reservationRepo.findById(id).get();
		return mapToDto(reservation);
	}

	public List<ReservationResponse> getRepairerReservations(String username) {
		return reservationRepo.findByRepairer(username).stream()
				.sorted(Comparator.comparingLong(Reservation::getId).reversed()).map(this::mapToDto)
				.collect(Collectors.toList());
	}

	public List<ClientReservationResponse> getClientReservations(String username) {
		return reservationRepo.findAllByClientUsername(username).stream()
				.sorted(Comparator.comparingLong(Reservation::getId).reversed()).map(this::mapToClientReservDto)
				.collect(Collectors.toList());
	}

	public void makeSuccess(Long id) {
		Reservation reservation = reservationRepo.findById(id)
				.orElseThrow(() -> new RuntimeException("Reservation not found"));
		reservation.setSuccess(true);
		LocalDateTime currentDateTime = LocalDateTime.now();

		// Récupérer la facture associée à la réservation
		Invoice invoice = new Invoice();
		invoice.setReservation(reservation);
		invoice.setPayedAmount(reservation.getReparation().getPrice());

		invoice.setDate(currentDateTime);
		invoice.setRef(reservation.getRef());
		invoiceRepo.save(invoice);

		// Préparer les informations de la facture sous forme de texte
		String invoiceText = createInvoiceText(invoice);

		// Envoyer l'email avec les informations de la facture en texte
		sendNewDeliveryEmail(reservation, invoiceText);

		reservationRepo.save(reservation);
	}

	private String createInvoiceText(Invoice invoice) {
		StringBuilder invoiceText = new StringBuilder();
		invoiceText.append("Référence: ").append(invoice.getRef()).append("\n");
		invoiceText.append("Date: ").append(invoice.getDate().format(dateFormatter)).append("\n");
		invoiceText.append("Montant a payer: ")
				.append(invoice.getPayedAmount() + ((invoice.getPayedAmount() * 20) / 100)).append("dh\n");

		// Ajouter d'autres informations nécessaires

		return invoiceText.toString();
	}

	@Async
	private void sendNewDeliveryEmail(Reservation reservation, String invoiceText) {
		// Envoyer un email au client avec les informations de la facture
		mailService.sendMail(
				new NotificationEmail("Votre Facture de Réservation", reservation.getClient().getEmail(), invoiceText));

		// Notifier les livreurs
		List<Livreur> livreurs = livreurRepo
				.findLivreursWithNoStatusZeroDeliveries(reservation.getReparation().getRepairer().getCity());
		System.out.println("delivery lenght" + reservation.getReparation().getRepairer().getCity());
		for (Livreur livreur : livreurs) {
			mailService.sendMail(new NotificationEmail("Nouvelle reservation à livrer", livreur.getEmail(),
					"Une nouvelle reservaton pour vous : http://localhost:3000/front/new-reservation/deliver-back/"
							+ reservation.getId()));
		}
	}

	@Async
	private void notResolvedEmail(Request request) {
		List<Admin> admins = adminRepo.findAll();

		for (Admin admin : admins) {
			mailService.sendMail(new NotificationEmail("Reservation non résolue", admin.getEmail(),
					"Reservation non résolue : http://localhost:3000/admin/new-request/" + request.getId()));
		}
	}

	public List<ReservationResponse> getReservationsByLivreurName(String livreurName) {
		Optional<Livreur> optionalLivreur = livreurRepo.findByUsername(livreurName);
		if (optionalLivreur.isPresent()) {
			List<Reservation> reservations = reservationRepo.findByLivreurName(optionalLivreur.get().getUsername());
			return reservations.stream().map(ReservationResponse::new).collect(Collectors.toList());
		}
		return null;
	}

	public void genInvoice(InvoiceRequest invoiceRequest) {
		Reservation reservation = reservationRepo.findById(invoiceRequest.getReservationId()).get();
		Invoice invoice = new Invoice();
		invoice.setReservation(reservation);
		invoice.setDescription(invoiceRequest.getDescription());
		invoiceRepo.save(invoice);
	}

	@Transactional
	public void makeNotResolved(Long id) {
		Reservation reservation = reservationRepo.findById(id).get();
		reservation.setResolvable(false);

		reservationRepo.save(reservation);

		Request request = new Request();
		LocalDateTime currentDateTime = LocalDateTime.now();
		request.setModel(reservation.getReparation().getModel());
		request.setClient(reservation.getClient());
		request.setProblem(reservation.getReparation().getProblem());
		request.setDate(currentDateTime);
		request.setRepairer(reservation.getReparation().getRepairer());
		requestRepo.save(request);
		notResolvedEmail(request);

	}

	public ReservationRequest createReservationTypeProblemAutre(ReservationRequest reservationRequest) {
		LocalDateTime currentDateTime = LocalDateTime.now();
		Model model = modelRepo.findById(reservationRequest.getModelId())
				.orElseThrow(() -> new IllegalArgumentException("Invalid model ID"));
		Client client = clientRepo.findByUsername(reservationRequest.getUsername())
				.orElseThrow(() -> new IllegalArgumentException("Invalid username"));

		Problem problem = problemRepo.findByNameAndCategoryModelName("Autre", "Autre")
				.orElseGet(() -> createDefaultProblem());

		Reparation reparation = createReparation(model, problem);
		Reservation reservation = createReservation(reservationRequest, client, reparation, currentDateTime);

		if (reservationRequest.getImgReservations() != null && !reservationRequest.getImgReservations().isEmpty()) {
			saveImageReservations(reservationRequest.getImgReservations(), reservation);
		}

		List<Admin> admins = adminRepo.findAll();

		for (Admin admin : admins) {
			mailService
					.sendMail(new NotificationEmail("Reservation non résolue", admin.getEmail(), "Nouvelles demandes"));
		}
		return reservationRequest;
	}

	private Reservation createReservation(ReservationRequest reservationRequest, Client client, Reparation reparation,
			LocalDateTime currentDateTime) {
		Reservation reservation = new Reservation();
		reservation.setReparation(reparation);
		reservation.setClient(client);
		reservation.setResolvable(true);
		reservation.setDescription(reservationRequest.getDescription());
		reservation.setDate(currentDateTime);
		return reservationRepo.save(reservation);
	}

	private void saveImageReservations(List<String> imgReservations, Reservation reservation) {
		for (String img : imgReservations) {
			Optional<ImageReservation> optionalImgReservation = imageReservationRepo.findBySrc(img);
			if (optionalImgReservation.isPresent()) {
				ImageReservation imageReservation = optionalImgReservation.get();
				imageReservation.setReservation(reservation);
				imageReservationRepo.save(imageReservation);
			}
		}
	}

	private Problem createDefaultProblem() {
		CategoryModel categoryModel = categoryModelRepo.findByName("Autre").orElseGet(() -> {
			CategoryModel newCategoryModel = new CategoryModel();
			newCategoryModel.setName("Autre");
			newCategoryModel.setDescription("Autre");
			return categoryModelRepo.save(newCategoryModel);
		});

		Problem problem = new Problem();
		problem.setCategoryModel(categoryModel);
		problem.setName("Autre");
		problem.setDescription("Autre");
		return problemRepo.save(problem);
	}

	private Reparation createReparation(Model model, Problem problem) {
		Reparation reparation = new Reparation();
		reparation.setModel(model);
		reparation.setProblem(problem);
		return reparationRepo.save(reparation);
	}

	public List<ReservationResponse> findReservationsWithNullReparationDetails() {
		List<Reservation> reservations = reservationRepo.findReservationsWithNullReparationDetails();
		List<ReservationResponse> reservationResponses = reservations.stream()
				.sorted(Comparator.comparingLong(Reservation::getId).reversed()).map(this::mapToDto)
				.collect(Collectors.toList());
		return reservationResponses;
	}

	public Reservation Affecter(String ref, Affecter affecter) {

		Reservation reservationOptional = reservationRepo.findByRef(ref);

		if (reservationOptional != null) {
			Repairer repairer = repairerRepo.findById(affecter.getRepairerId()).get();
			Reparation reparation = reservationOptional.getReparation();
			reparation.setPrice(affecter.getPrice());
			reparation.setRepairer(repairer);
			reparationRepo.save(reparation);
			sendEmails(reservationOptional.getClient().getEmail(), repairer.getEmail(), reservationOptional);
			return reservationOptional;
		} else {
			return null;
		}

	}

}
