package com.example.masterReparateur.exception;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {
	@ExceptionHandler(MasterException.class)
	public ResponseEntity<String> handleCustomException(MasterException ex) {
		String errorMessage = ex.getMessage();
		return ResponseEntity.status(ex.getStatus()).body(errorMessage);
	}

	@Override
	protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
			HttpHeaders headers, HttpStatus status, WebRequest request) {
		Map<String, List<String>> body = new HashMap<>();

		List<FieldError> fieldErrors = ex.getBindingResult().getFieldErrors();

		// Group errors by field name
		for (FieldError fieldError : fieldErrors) {
			String fieldName = fieldError.getField();
			String errorMessage = fieldError.getDefaultMessage();

			// Add error message to corresponding field in the body map
			body.computeIfAbsent(fieldName, k -> new ArrayList<>()).add(errorMessage);
		}

		return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
	}
}
