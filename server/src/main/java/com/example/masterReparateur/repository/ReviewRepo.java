package com.example.masterReparateur.repository;

import com.example.masterReparateur.models.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReviewRepo extends JpaRepository<Review, Long> {
	@Query("SELECT (COUNT(r) > 0) " + "FROM Review r " + "WHERE r.client.id = :clientId "
			+ "AND r.repairer.id = :repairerId")
	boolean existsReviewByClientIdAndRepairerId(@Param("clientId") Long clientId, @Param("repairerId") Long repairerId);

	@Query("SELECT (COUNT(res) > 0) " + "FROM Reservation res " + "WHERE res.client.id = :clientId "
			+ "AND res.reparation.repairer.id = :repairerId")
	boolean existsReservationByClientIdAndRepairerId(@Param("clientId") Long clientId,
			@Param("repairerId") Long repairerId);
}
