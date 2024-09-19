package com.example.masterReparateur.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.masterReparateur.dto.AuthenticationResponse;
import com.example.masterReparateur.dto.LivreurRequest;
import com.example.masterReparateur.dto.LoginRequest;
import com.example.masterReparateur.dto.RefreshTokenRequest;
import com.example.masterReparateur.dto.RegisterRequest;
import com.example.masterReparateur.dto.UserCheckerRequest;
import com.example.masterReparateur.exception.MasterException;
import com.example.masterReparateur.security.JwtProvider;
import com.example.masterReparateur.service.AuthService;
import com.example.masterReparateur.service.RefreshTokenService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {

	private JwtProvider jwtProvider;
	private final AuthService authService;
	private final RefreshTokenService refreshTokenService;

	@PostMapping("/signup")
	public ResponseEntity<String> signup(@Valid @RequestBody RegisterRequest registerRequest) {
		authService.signup(registerRequest);
		return new ResponseEntity<>("User registration successful", HttpStatus.OK);
	}

	@PostMapping("/livreur/signup")
	public ResponseEntity<String> signupLivreur(@Valid @RequestBody LivreurRequest livreurRequest) {
		authService.livreurSignup(livreurRequest);
		return new ResponseEntity<>("LIvreur registration successful", HttpStatus.CREATED);
	}

	@PostMapping("accountverification/{token}")
	public ResponseEntity<String> verifyAccount(@PathVariable String token) {
		authService.verifyAccount(token);
		return new ResponseEntity<String>("Account active", HttpStatus.OK);
	}

	@PostMapping("/login")
	public AuthenticationResponse login(@Valid @RequestBody LoginRequest loginRequest) {
		return authService.login(loginRequest);
	}

	@PostMapping("/refresh/token")
	public AuthenticationResponse refreshToken(@Valid @RequestBody RefreshTokenRequest refreshTokenRequest) {
		return authService.refreshToken(refreshTokenRequest);
	}

	@PostMapping("/logout")
	public ResponseEntity<String> logout(@Valid @RequestBody RefreshTokenRequest refreshTokenRequest) {
		refreshTokenService.deleteRefreshToken(refreshTokenRequest.getRefreshToken());
		return ResponseEntity.status(HttpStatus.OK).body("Refresh Token Deleted Successfully!!");
	}

	@PostMapping("/verify/{token}")
	public ResponseEntity<String> verifyToken(@PathVariable String token) {
		if (jwtProvider.validateToken(token))
			return ResponseEntity.ok("ok");
		else
			throw new MasterException("Token is expired", HttpStatus.FORBIDDEN);
	}

	@PostMapping("/check-available")
	public ResponseEntity<String> checkAvailable(@RequestBody UserCheckerRequest userCheckerRequest) {

		if (authService.checkAvailable(userCheckerRequest))
			throw new MasterException("User exists", HttpStatus.FOUND);
		else
			return ResponseEntity.ok("okay");
	}

	@PostMapping("/emailChangePassById/{id}")
	public ResponseEntity<String> emailChangePassById(@PathVariable Long id) {
		authService.emailPassword(id);
		return ResponseEntity.ok("ok");
	}

	@PostMapping("/ChangePassword/{id}/{password}")
	public ResponseEntity<String> ChangePassword(@PathVariable Long id, @PathVariable String password) {
		authService.changerPassword(id, password);
		return ResponseEntity.ok("Votre mot de passe à été Changer");
	}

	@PostMapping("/emailChangePassByEmail/{email}")
	public ResponseEntity<String> emailChangePassByEmail(@PathVariable String email) {
		authService.changePasswordByEmail(email);
		return ResponseEntity.ok("ok");
	}

}
