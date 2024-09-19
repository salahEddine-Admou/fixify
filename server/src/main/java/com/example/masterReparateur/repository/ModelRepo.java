package com.example.masterReparateur.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.masterReparateur.models.Model;

@Repository
public interface ModelRepo extends JpaRepository<Model, Long> {

	@Query("SELECT DISTINCT p.model FROM Price p WHERE p.problem.id = :problemId")
	List<Model> findAllModelsByProblemId(@Param("problemId") Long problemId);

	Optional<Model> findByName(String name);
}
