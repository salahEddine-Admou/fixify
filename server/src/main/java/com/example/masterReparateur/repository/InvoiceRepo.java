package com.example.masterReparateur.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.masterReparateur.models.Invoice;

@Repository
public interface InvoiceRepo extends JpaRepository<Invoice, Long> {

}
