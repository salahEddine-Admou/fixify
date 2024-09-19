package com.example.masterReparateur.repository;

import java.util.List;
import java.util.Optional;

import com.example.masterReparateur.models.Model;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.masterReparateur.models.Livreur;
import com.example.masterReparateur.models.Repairer;

@Repository
public interface LivreurRepo extends JpaRepository<Livreur, Long> {
	List<Livreur> findByEmailVerifiedTrue();

	Optional<Livreur> findByCin(String cin);

	Optional<Livreur> findByRib(String rib);

	Optional<Livreur> findByUsername(String username);

	// @Query("SELECT DISTINCT l FROM Livreur l " +
	// "LEFT JOIN l.deliveries d " +
	// "WHERE (d.status != 0 OR d.id IS NULL) AND l.city=:city")
	@Query("SELECT l FROM Livreur l " + "LEFT JOIN l.deliveries d " + "WHERE l.city = :city " + "GROUP BY l.id "
			+ "HAVING SUM(CASE WHEN d.status = 0 THEN 1 ELSE 0 END) <= 3  OR COUNT(d) = 0")
	List<Livreur> findLivreursWithNoStatusZeroDeliveries(@Param("city") String city);

}
