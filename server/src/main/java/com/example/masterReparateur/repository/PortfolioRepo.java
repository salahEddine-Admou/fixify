package com.example.masterReparateur.repository;

import com.example.masterReparateur.models.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PortfolioRepo extends JpaRepository<Portfolio, Long> {
	Optional<Portfolio> findBySrc(String src);

	void deleteAllByRepairerId(Long repairerId);
}
