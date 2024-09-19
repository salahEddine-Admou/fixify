package com.example.masterReparateur.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.masterReparateur.models.Admin;

/**
 * AdminRepo
 */
@Repository
public interface AdminRepo extends JpaRepository<Admin, Long> {

}