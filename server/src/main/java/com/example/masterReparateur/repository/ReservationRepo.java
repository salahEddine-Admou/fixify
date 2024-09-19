package com.example.masterReparateur.repository;

import com.example.masterReparateur.models.*;

import org.springframework.data.domain.Pageable;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReservationRepo extends JpaRepository<Reservation, Long> {

	@Query("select r from   Reservation r where r.reparation.repairer = :repairer")
	List<Reservation> findByRepairer(@Param("repairer") Repairer repairer);

	@Query("SELECT DISTINCT r FROM Reservation r INNER JOIN r.deliveries d WHERE d.livreur.username = :username")
	List<Reservation> findByLivreurName(@Param("username") String username);

	Reservation findByRef(String ref);

	@Query("SELECT FUNCTION('DATE_FORMAT', r.date, '%Y-%m'), COUNT(r) FROM Reservation r GROUP BY FUNCTION('DATE_FORMAT', r.date, '%Y-%m') ORDER BY FUNCTION('DATE_FORMAT', r.date, '%Y-%m')")
	List<Object[]> countReservationsByMonth();

	@Query("SELECT r FROM Reservation r WHERE r.deliveries IS EMPTY")
	List<Reservation> findReservationsWithZeroDeliveries();

	@Query("select r from   Reservation r where r.reparation.repairer.username = :repairer")
	List<Reservation> findByRepairer(@Param("repairer") String repairer);

	@Query("SELECT COUNT(r) FROM Reservation r WHERE r.client.gender = :gender")
	long countByClientGender(boolean gender);

	boolean existsByReparationModelSubCategoryModelCategoryModel(CategoryModel category);

	boolean existsByReparationModelSubCategoryModel(SubCategoryModel subCategoryModel);

	boolean existsByReparationModel(Model model);

	boolean existsByReparationProblem(Problem problem);

	@Query("SELECT c.username as name,c.imageProfile as imageProfile, COUNT(r.id) as reservationCount FROM Reservation r JOIN r.client c GROUP BY c.id ORDER BY reservationCount DESC")
	List<Map<String, Object>> findTopClients(Pageable pageable);

	@Query("SELECT rep.repairer.username as username,rep.repairer.imageProfile as imageProfile, COUNT(r.id) as reservationCount "
			+ "FROM Reservation r " + "JOIN r.reparation rep " + "GROUP BY rep.repairer.id "
			+ "ORDER BY reservationCount DESC")
	List<Map<String, Object>> findTopReparateurs(Pageable pageable);

	@Query("SELECT rep.repairer.city , COUNT(r) FROM Reservation r JOIN r.reparation rep GROUP BY rep.repairer.city")
	List<Object[]> getReservationsByCity();

	@Query("SELECT COUNT(r) FROM Reservation r WHERE r.success = true AND r.reparation.repairer.username = :username")
	Long countBySuccessTrueAndRepairerUsername(String username);

	@Query("SELECT COUNT(r) FROM Reservation r WHERE r.success = false AND r.reparation.repairer.username = :username")
	Long countBySuccessFalseAndRepairerUsername(String username);

	@Query("SELECT c.username AS name, c.imageProfile AS imageProfile, COUNT(r.id) AS reservationCount "
			+ "FROM Reservation r " + "JOIN r.client c " + "WHERE r.reparation.repairer.username = :username "
			+ "GROUP BY c.id " + "ORDER BY reservationCount DESC")
	List<Map<String, Object>> findTopClientsByRepairer(Pageable pageable, @Param("username") String username);

	@Query("SELECT COUNT(r) FROM Reservation r WHERE r.reparation.repairer.username = :username")
	Long countByRepairerUsername(String username);

	@Query("SELECT r FROM Reservation r WHERE r.reparation.repairer IS NULL  ORDER BY r.id DESC")
	List<Reservation> findReservationsWithNullReparationDetails();

	@Query("SELECT r FROM Reservation r WHERE r.reparation.repairer IS NOT NULL  ORDER BY r.id DESC")
	List<Reservation> findAll();

	List<Reservation> findAllByClientUsername(String username);

	@Query("SELECT r.reparation.problem.name as problem, COUNT(r) as reservationCount " + "FROM Reservation r "
			+ "JOIN r.reparation rep " + "WHERE rep.repairer.username = :username " + "GROUP BY r.reparation.problem")
	List<Map<String, Object>> countReservationsByProblemAndRepairerUsername(@Param("username") String username);

	@Query("SELECT r.reparation.problem.categoryModel.name as category, COUNT(r) as reservationCount "
			+ "FROM Reservation r " + "JOIN r.reparation rep " + "GROUP BY r.reparation.problem.categoryModel.name")
	List<Map<String, Object>> countReservationsByCategory();

}
