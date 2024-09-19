package com.example.masterReparateur.exception;

import org.springframework.http.HttpStatus;

public class MasterException extends RuntimeException {
	private final HttpStatus status;

	public MasterException(String message, HttpStatus status) {
		super(message);
		this.status = status;
	}

	public HttpStatus getStatus() {
		return status;
	}

}