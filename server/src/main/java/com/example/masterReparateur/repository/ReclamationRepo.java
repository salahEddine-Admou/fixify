package com.example.masterReparateur.repository;

import com.example.masterReparateur.models.Reclamation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReclamationRepo extends JpaRepository<Reclamation, Long> {

}
