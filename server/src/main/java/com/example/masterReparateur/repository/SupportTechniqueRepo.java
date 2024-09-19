package com.example.masterReparateur.repository;

import com.example.masterReparateur.models.SupportTechnique;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupportTechniqueRepo extends JpaRepository<SupportTechnique, Long> {

}
