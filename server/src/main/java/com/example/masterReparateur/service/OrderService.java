package com.example.masterReparateur.service;

import com.example.masterReparateur.exception.*;
import com.example.masterReparateur.models.Order;
import com.example.masterReparateur.repository.OrderRepo;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {
	private final OrderRepo orderRepo;

	public OrderService(OrderRepo orderRepo) {
		this.orderRepo = orderRepo;
	}

	public List<Order> getAllOrders() {
		return orderRepo.findAll();
	}

	public Order getOrderById(Long id) {
		Optional<Order> optionalOrder = orderRepo.findById(id);
		if (optionalOrder.isPresent()) {
			return optionalOrder.get();
		} else {
			throw new MasterException("Commande introuvable", HttpStatus.NOT_FOUND);
		}
	}

	public Order createOrder(Order order) {
		try {
			return orderRepo.save(order);
		} catch (Exception e) {
			throw new MasterException("Erreur lors de la création du commande", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public Order updateOrder(Long id, Order order) {
		Optional<Order> optionalOrder = orderRepo.findById(id);
		if (optionalOrder.isPresent()) {
			Order existingOrder = optionalOrder.get();
			return orderRepo.save(existingOrder);
		} else {
			throw new MasterException("Commande introuvable", HttpStatus.NOT_FOUND);
		}
	}

	public void deleteOrder(Long id) {
		Optional<Order> optionalOrder = orderRepo.findById(id);
		if (optionalOrder.isPresent()) {
			orderRepo.deleteById(id);
		} else {
			throw new MasterException("Commande introuvable", HttpStatus.NOT_FOUND);
		}
	}
}
