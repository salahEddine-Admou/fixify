package com.example.masterReparateur.repository;

import com.example.masterReparateur.dto.RepairerDto;
import com.example.masterReparateur.models.Livreur;
import com.example.masterReparateur.models.Repairer;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface RepairerRepo extends JpaRepository<Repairer, Long> {

	boolean existsByUsername(String username);

	Optional<Repairer> findByCin(String cin);

	Optional<Repairer> findByRib(String rib);

	Optional<Repairer> findByUsername(String username);

	@Query("select r.repairer from Reparation r where r.repairer.active=true and r.repairer.disonible=true and r.repairer.emailVerified=true and r.model.id = :modelId and r.problem.id= :problemTypeId and r.repairer.city= :city")
	Page<Repairer> getReapairersByModelAndProblemTypeAndCity(@Param("modelId") Long modelId,
			@Param("problemTypeId") Long problemTypeId, @Param("city") String city, Pageable pageable);

	@Query("select r.repairer from Reparation r where r.repairer.active=true and r.repairer.disonible=true and r.repairer.emailVerified=true and r.model.id = :modelId and r.problem.id= :problemTypeId and r.repairer.city= :city")
	List<Repairer> getReapairersByModelAndProblemTypeAndCity(@Param("modelId") Long modelId,
			@Param("problemTypeId") Long problemTypeId, @Param("city") String city);

	@Transactional
	@Modifying
	@Query("DELETE FROM Reparation r WHERE r.repairer.id = :reparateurId")
	void deleteByReparateurId(Long reparateurId);

	@Query("SELECT r FROM Repairer r " + "LEFT JOIN r.reviews rv " + "GROUP BY r "
			+ "ORDER BY COUNT(rv) DESC, AVG(rv.rating) DESC")
	List<Repairer> findTopRapairers();

	@Query("SELECT r FROM Repairer r WHERE r.pro = true")
	List<Repairer> findAllProRepairers();

}
