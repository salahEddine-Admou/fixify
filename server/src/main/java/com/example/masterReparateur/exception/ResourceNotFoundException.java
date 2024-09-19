package com.example.masterReparateur.exception;

public class ResourceNotFoundException extends RuntimeException {

	public ResourceNotFoundException(String message) {
		super(message);
	}

	public ResourceNotFoundException(String message, Throwable cause) {
		super(message, cause);
	}

	// Vous pouvez ajouter d'autres constructeurs ou méthodes si nécessaire
}
