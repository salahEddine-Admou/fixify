package com.example.masterReparateur.repository;

import com.example.masterReparateur.models.Delivery;
import com.example.masterReparateur.models.Reservation;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DeliveryRepo extends JpaRepository<Delivery, Long> {

	List<Delivery> findAllByReservation(Reservation reservation);

}
