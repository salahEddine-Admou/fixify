package com.example.masterReparateur.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.masterReparateur.models.Order;

@Repository
public interface OrderRepo extends JpaRepository<Order, Long> {

}
