package com.example.masterReparateur.repository;

import com.example.masterReparateur.models.ImageReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ImageReservationRepo extends JpaRepository<ImageReservation, Long> {
	Optional<ImageReservation> findBySrc(String src);
}
