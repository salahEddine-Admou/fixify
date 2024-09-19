package com.example.masterReparateur.service;

import com.example.masterReparateur.dto.ClientResponse;
import com.example.masterReparateur.dto.DashboardDto;
import com.example.masterReparateur.dto.ReservationCountDto;
import com.example.masterReparateur.exception.MasterException;
import com.example.masterReparateur.models.Client;
import com.example.masterReparateur.models.Livreur;
import com.example.masterReparateur.models.NotificationEmail;
import com.example.masterReparateur.models.Repairer;
import com.example.masterReparateur.repository.AdminRepo;
import com.example.masterReparateur.repository.ClientRepo;

import com.example.masterReparateur.repository.LivreurRepo;
import com.example.masterReparateur.repository.RepairerRepo;
import com.example.masterReparateur.repository.ReservationRepo;

import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AdminService {
	private final AdminRepo adminRepo;
	private final ClientRepo clientRepo;
	private final RepairerRepo repairerRepo;
	private final MailService mailService;
	private final LivreurRepo livreurRepo;
	private final ReservationRepo reservationRepo;

	public List<ClientResponse> clientsList() {

		List<Client> clients = clientRepo.findAll();
		List<ClientResponse> clientResponses = clients.stream().map(this::mapToDto).collect(Collectors.toList());
		System.out.println(clientResponses);
		return clientResponses;

	}

	private ClientResponse mapToDto(Client client) {
		return new ClientResponse(client);
	}

	public void activateClient(Long id) {
		Client client = clientRepo.findById(id)
				.orElseThrow(() -> new MasterException("Client introuvable", HttpStatus.NOT_FOUND));
		client.setActive(true);
		clientRepo.save(client);
	}

	public void desactivateClient(Long id) {
		Client client = clientRepo.findById(id)
				.orElseThrow(() -> new MasterException("Client introuvable", HttpStatus.NOT_FOUND));
		client.setActive(false);
		clientRepo.save(client);
	}

	public void activateRepairer(Long id) {
		Repairer repairer = repairerRepo.findById(id)
				.orElseThrow(() -> new MasterException("Repairer introuvable", HttpStatus.NOT_FOUND));
		repairer.setActive(true);
		repairerRepo.save(repairer);
		mailService.sendMail(new NotificationEmail("Votre compte a été activé", repairer.getEmail(),
				"Votre compte a été activé par notre équipe. Vous pouvez maintenant accéder à votre profil : http://localhost:3000"));
	}

	public void desactivateRepairer(Long id) {
		Repairer repairer = repairerRepo.findById(id)
				.orElseThrow(() -> new MasterException("Repairer introuvable", HttpStatus.NOT_FOUND));
		repairer.setActive(false);
		repairerRepo.save(repairer);
	}

	public void activateLivreur(Long id) {
		Livreur livreur = livreurRepo.findById(id)
				.orElseThrow(() -> new MasterException("Livreur introuvable", HttpStatus.NOT_FOUND));
		livreur.setActive(true);
		livreurRepo.save(livreur);
		mailService.sendMail(new NotificationEmail("Votre compte a été activé", livreur.getEmail(),
				"Votre compte a été activé par notre équipe. Vous pouvez maintenant accéder à votre profil : http://localhost:3000"));
	}

	public void desactivateLivreur(Long id) {
		Livreur livreur = livreurRepo.findById(id)
				.orElseThrow(() -> new MasterException("Livreur introuvable", HttpStatus.NOT_FOUND));
		livreur.setActive(false);
		livreurRepo.save(livreur);
	}

	public long getTotalClients() {
		return clientRepo.count();
	}

	public long getTotalRepairers() {
		return repairerRepo.count();
	}

	public long getTotalDeliveryPersons() {
		return livreurRepo.count();
	}

	public DashboardDto dashboard() {

		DashboardDto dashboardDto = new DashboardDto();
		List<Object[]> results = reservationRepo.countReservationsByMonth();

		dashboardDto.setReservationsCount(results.stream()
				.map(result -> new ReservationCountDto(YearMonth.parse((String) result[0]), (Long) result[1]))
				.collect(Collectors.toList()));

		return dashboardDto;
	}

}
