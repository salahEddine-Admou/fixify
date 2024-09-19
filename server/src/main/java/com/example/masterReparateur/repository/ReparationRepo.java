package com.example.masterReparateur.repository;

import com.example.masterReparateur.models.Model;
import com.example.masterReparateur.models.Price;
import com.example.masterReparateur.models.Problem;
import com.example.masterReparateur.models.Repairer;
import com.example.masterReparateur.models.Reparation;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReparationRepo extends JpaRepository<Reparation, Long> {
	List<Reparation> findByRepairer(Repairer repairer);

	List<Reparation> findByRepairerId(Long repairerId);

	boolean existsByRepairer_IdAndModel_Id(Long repairerId, Long modelId);

	@Query("SELECT r FROM Reparation r WHERE r.model.id = :modelId AND r.repairer.username = :username AND r.problem.name <> 'Autre'")
	List<Reparation> findAllByModelIdAndRepairerUsername(@Param("modelId") Long modelId,
			@Param("username") String username);

	Optional<Reparation> findByModelIdAndProblemIdAndRepairerUsername(Long modelId, Long problemId, String username);

	Optional<Reparation> findByModelIdAndProblemIdAndRepairerId(Long modelId, Long problemId, Long repairerId);

}
