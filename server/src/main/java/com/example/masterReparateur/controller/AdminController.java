package com.example.masterReparateur.controller;

import com.example.masterReparateur.dto.ClientResponse;
import com.example.masterReparateur.repository.ReservationRepo;
import com.example.masterReparateur.dto.DashboardDto;
import com.example.masterReparateur.service.AdminService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api/admin")
@AllArgsConstructor
public class AdminController {

	private final AdminService adminService;
	private final ReservationRepo reservationRepo;

	@GetMapping("/clients")
	private ResponseEntity<List<ClientResponse>> clientsList() {
		List<ClientResponse> clients = adminService.clientsList();
		return ResponseEntity.ok(clients);

	}

	@GetMapping("/dashboard")
	private ResponseEntity<DashboardDto> dashboard() {
		DashboardDto dashboardDto = adminService.dashboard();
		return ResponseEntity.ok(dashboardDto);
	}

	@PutMapping("/activate-client/{id}")
	private ResponseEntity<String> activateClient(@PathVariable Long id) {
		adminService.activateClient(id);
		return ResponseEntity.ok("ok");
	}

	@PutMapping("/desactivate-client/{id}")
	private ResponseEntity<String> desactivateClient(@PathVariable Long id) {
		adminService.desactivateClient(id);
		return ResponseEntity.ok("ok");
	}

	@PutMapping("/activate-repairer/{id}")
	private ResponseEntity<String> activateRepairer(@PathVariable Long id) {
		adminService.activateRepairer(id);
		return ResponseEntity.ok("ok");
	}

	@PutMapping("/desactivate-repairer/{id}")
	private ResponseEntity<String> desactivateRepairer(@PathVariable Long id) {
		adminService.desactivateRepairer(id);
		return ResponseEntity.ok("ok");
	}

	@PutMapping("/activate-livreur/{id}")
	private ResponseEntity<String> activateLivreur(@PathVariable Long id) {
		adminService.activateLivreur(id);
		return ResponseEntity.ok("ok");
	}

	@PutMapping("/desactivate-livreur/{id}")
	private ResponseEntity<String> desactivateLivreur(@PathVariable Long id) {
		adminService.desactivateLivreur(id);
		return ResponseEntity.ok("ok");
	}

	@GetMapping("/stats")
	public ResponseEntity<Map<String, Long>> getDashboardStats() {
		Map<String, Long> stats = new HashMap<>();
		stats.put("totalClients", adminService.getTotalClients());
		stats.put("totalRepairers", adminService.getTotalRepairers());
		stats.put("totalDeliveryPersons", adminService.getTotalDeliveryPersons());
		return ResponseEntity.ok(stats);
	}

	@GetMapping("/reservations-by-gender")
	public ResponseEntity<Map<String, Long>> getReservationsByGender() {

		long femaleReservations = reservationRepo.countByClientGender(false);
		long maleReservations = reservationRepo.countByClientGender(true);
		Map<String, Long> result = new HashMap<>();
		result.put("Female", femaleReservations);
		result.put("Male", maleReservations);
		System.out.println(result);
		return ResponseEntity.ok(result);
	}

	@GetMapping("/top-clients")
	public ResponseEntity<List<Map<String, Object>>> getTopClients() {
		List<Map<String, Object>> topClients = reservationRepo.findTopClients(PageRequest.of(0, 5));
		return ResponseEntity.ok(topClients);
	}

	@GetMapping("/top-reparateurs")
	public ResponseEntity<List<Map<String, Object>>> getTopRepairers() {
		List<Map<String, Object>> topRepairers = reservationRepo.findTopReparateurs(PageRequest.of(0, 5));
		return ResponseEntity.ok(topRepairers);
	}

	@GetMapping("/reservations/by-city")
	public Map<String, Long> getReservationsByCity() {
		List<Object[]> results = reservationRepo.getReservationsByCity();
		System.out.println(
				results.stream().collect(Collectors.toMap(array -> (String) array[0], array -> (Long) array[1])));
		return results.stream().collect(Collectors.toMap(array -> (String) array[0], array -> (Long) array[1]));
	}

	@GetMapping("/count-by-category")
	public ResponseEntity<List<Map<String, Object>>> countReservationsByCategoryAndRepairer() {
		List<Map<String, Object>> result = reservationRepo.countReservationsByCategory();
		return ResponseEntity.ok(result);
	}

}
