package com.example.masterReparateur.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.masterReparateur.models.Client;
import com.example.masterReparateur.models.User;

@Repository
public interface ClientRepo extends JpaRepository<Client, Long> {
	Optional<Client> findByUsername(String username);
}
