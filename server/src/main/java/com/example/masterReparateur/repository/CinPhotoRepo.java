package com.example.masterReparateur.repository;

import java.util.Optional;

import com.example.masterReparateur.models.Repairer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.masterReparateur.models.CinPhoto;

@Repository
public interface CinPhotoRepo extends JpaRepository<CinPhoto, Long> {
	Optional<CinPhoto> findBySrc(String src);

	void deleteAllByRepairerId(Long repairerId);

	boolean existsBySrcAndRepairerId(String src, Long repairerId);
}
