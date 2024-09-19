package com.example.masterReparateur.controller;

import com.example.masterReparateur.models.Order;
import com.example.masterReparateur.service.OrderService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order")
@AllArgsConstructor
public class OrderController {

	private final OrderService orderService;

	@GetMapping
	public ResponseEntity<List<Order>> getAllOrders() {
		List<Order> orders = orderService.getAllOrders();
		return new ResponseEntity<>(orders, HttpStatus.OK);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
		Order order = orderService.getOrderById(id);
		return new ResponseEntity<>(order, order != null ? HttpStatus.OK : HttpStatus.NOT_FOUND);
	}

	@PostMapping
	public ResponseEntity<Order> createOrder(@RequestBody Order order) {
		Order createdOrder = orderService.createOrder(order);
		return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
	}

	@PutMapping("/{id}")
	public ResponseEntity<Order> updateOrder(@PathVariable Long id, @RequestBody Order order) {
		Order updatedOrder = orderService.updateOrder(id, order);
		return new ResponseEntity<>(updatedOrder, updatedOrder != null ? HttpStatus.OK : HttpStatus.NOT_FOUND);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
		orderService.deleteOrder(id);
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}
}
