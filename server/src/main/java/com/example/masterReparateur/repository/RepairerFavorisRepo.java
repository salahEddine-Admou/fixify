package com.example.masterReparateur.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.masterReparateur.models.RepairerFavoris;

public interface RepairerFavorisRepo extends JpaRepository<RepairerFavoris, Long> {
	List<RepairerFavoris> findAllByClientUsername(String username);

	Optional<RepairerFavoris> findByClientUsernameAndRepairerId(String username, Long id);
}
