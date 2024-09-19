package com.example.masterReparateur.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.masterReparateur.models.Model;
import com.example.masterReparateur.models.Price;
import com.example.masterReparateur.models.Problem;

@Repository
public interface PriceRepo extends JpaRepository<Price, Long> {
}
