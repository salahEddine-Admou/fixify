package com.example.masterReparateur.service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import javax.validation.Valid;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.masterReparateur.dto.AuthenticationResponse;
import com.example.masterReparateur.dto.LivreurRequest;
import com.example.masterReparateur.dto.LoginRequest;
import com.example.masterReparateur.dto.RefreshTokenRequest;
import com.example.masterReparateur.dto.RegisterRequest;
import com.example.masterReparateur.dto.UserCheckerRequest;
import com.example.masterReparateur.exception.MasterException;
import com.example.masterReparateur.models.Admin;
import com.example.masterReparateur.models.CinPhoto;
import com.example.masterReparateur.models.Client;
import com.example.masterReparateur.models.Livreur;
import com.example.masterReparateur.models.NotificationEmail;
import com.example.masterReparateur.models.Role;
import com.example.masterReparateur.models.User;
import com.example.masterReparateur.models.VerificationToken;
import com.example.masterReparateur.repository.AdminRepo;
import com.example.masterReparateur.repository.CinPhotoRepo;
import com.example.masterReparateur.repository.ClientRepo;
import com.example.masterReparateur.repository.LivreurRepo;
import com.example.masterReparateur.repository.UserRepository;
import com.example.masterReparateur.repository.VerificationTokenRepository;
import com.example.masterReparateur.security.JwtProvider;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class AuthService {
	private CinPhotoRepo cinPhotoRepo;
	private final PasswordEncoder passwordEncoder;
	private final ClientRepo clientRepo;
	private final LivreurRepo livreurRepo;
	private final AdminRepo adminRepo;
	private final UserRepository userRepository;
	private final VerificationTokenRepository verificationTokenRepository;
	private final MailService mailService;
	private AuthenticationManager authenticationManager;
	private final JwtProvider jwtProvider;
	private RefreshTokenService refreshTokenService;

	@Transactional
	public void signup(RegisterRequest registerRequest) {
		Client client = mapToClient(registerRequest);
		client.setActive(true);
		clientRepo.save(client);
		String token = generateVerificationToken(client);
		mailService.sendMail(new NotificationEmail("Please activate ur acount", client.getEmail(),
				"Click to this link to activate ur email: http://localhost:3000/auth/accountverification/" + token));
		// mailService.sendMail(new NotificationEmail("Please activate ur acount",
		// client.getEmail(),
		// "Click to this link to activate ur email:
		// http://localhost:8080/api/auth/accountverification/"
		// + token));

	}

	private String generateVerificationToken(User user) {
		String token = UUID.randomUUID().toString();
		VerificationToken verificationToken = new VerificationToken();
		verificationToken.setToken(token);
		verificationToken.setUser(user);
		verificationTokenRepository.save(verificationToken);
		return token;
	}

	public void verifyAccount(String token) {
		Optional<VerificationToken> verificationToken = verificationTokenRepository.findByToken(token);
		verificationToken.orElseThrow(() -> new MasterException("Invalid token", HttpStatus.BAD_REQUEST));
		fetchUserAndEnable(verificationToken.get());
	}

	@Transactional
	private void fetchUserAndEnable(VerificationToken verificationToken) {
		String username = verificationToken.getUser().getUsername();
		User user = userRepository.findByUsername(username)
				.orElseThrow(() -> new MasterException("user not found" + username, HttpStatus.NOT_FOUND));
		user.setEmailVerified(true);
		userRepository.save(user);
	}

	public AuthenticationResponse login(LoginRequest loginRequest) {
		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
		SecurityContextHolder.getContext().setAuthentication(authentication);
		String token = jwtProvider.generateToken(authentication);
		Optional<User> user = userRepository.findByUsername(loginRequest.getUsername());
		String role = "";
		if (user.isPresent() && user.get().isActive()) {
			switch (user.get().getRole()) {
			case CLIENT:
				role = "client";
				break;
			case ADMIN:
				role = "admin";
				break;
			case SUPPORT_TECHNIQUE:
				role = "support";
				break;
			case REPAIRER:
				role = "repairer";
				break;
			case LIVREUR:
				role = "livreur";
				break;
			default:
				role = "undefinded";
				break;
			}

			return AuthenticationResponse.builder().authenticationToken(token)
					.refreshToken(refreshTokenService.generateRefreshToken().getToken())
					.expiresAt(Instant.now().plusMillis(jwtProvider.getJwtExpireInMillis()))
					.username(loginRequest.getUsername()).role(role).build();

		} else if (!user.isPresent()) {
			throw new MasterException("User not found", HttpStatus.NOT_FOUND);

		} else if (!user.get().isActive()) {
			throw new MasterException("User is disabled", HttpStatus.NOT_FOUND);

		} else if (!user.get().isEmailVerified()) {
			throw new MasterException("User email is not verified", HttpStatus.NOT_FOUND);
		}
		return null;

	}

	@Transactional
	public User getCurrentUser() {
		try {
			org.springframework.security.core.userdetails.User principal = (org.springframework.security.core.userdetails.User) SecurityContextHolder
					.getContext().getAuthentication().getPrincipal();
			return userRepository.findByUsername(principal.getUsername()).orElseThrow(
					() -> new UsernameNotFoundException("User name not found - " + principal.getUsername()));
		} catch (Exception e) {
			throw new MasterException(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	public boolean isLoggedIn() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		return !(authentication instanceof AnonymousAuthenticationToken) && authentication.isAuthenticated();
	}

	public AuthenticationResponse refreshToken(@Valid RefreshTokenRequest refreshTokenRequest) {
		refreshTokenService.validateRefreshToken(refreshTokenRequest.getRefreshToken());
		String token = jwtProvider.generateTokenWithUserName(refreshTokenRequest.getUsername());
		return AuthenticationResponse.builder().authenticationToken(token)
				.refreshToken(refreshTokenRequest.getRefreshToken())
				.expiresAt(Instant.now().plusMillis(jwtProvider.getJwtExpireInMillis()))
				.username(refreshTokenRequest.getUsername()).build();
	}

	@Transactional
	public void livreurSignup(LivreurRequest livreurRequest) {
		Livreur livreur = mapToLivreur(livreurRequest);
		livreurRepo.save(livreur);
		for (String img : livreurRequest.getImageIdentity()) {
			CinPhoto cinPhoto = cinPhotoRepo.findBySrc(img).get();
			cinPhoto.setLivreur(livreur);
			cinPhotoRepo.save(cinPhoto);
		}
		String token = generateVerificationToken(livreur);
		mailService.sendMail(new NotificationEmail("Please activate ur acount", livreur.getEmail(),
				"Click to this link to activate ur email: http://localhost:3000/auth/accountverification/" + token));
	}

	public boolean checkAvailable(UserCheckerRequest userCheckerRequest) {

		if (userCheckerRequest.getUsername() != "") {
			Optional<User> user = userRepository.findByUsername(userCheckerRequest.getUsername());
			return user.isPresent();
		}

		else {
			Optional<User> user = userRepository.findByEmail(userCheckerRequest.getEmail());
			return user.isPresent();
		}

	}

	public Livreur mapToLivreur(LivreurRequest livreurRequest) {
		Livreur livreur = new Livreur();
		livreur.setCin(livreurRequest.getCin());
		livreur.setImageProfile(livreurRequest.getImageProfile());
		livreur.setPhone(livreurRequest.getPhone());
		livreur.setUsername(livreurRequest.getUsername());
		livreur.setFirstName(livreurRequest.getFirstName());
		livreur.setLastName(livreurRequest.getLastName());
		livreur.setGender(livreurRequest.isGender());
		livreur.setRib(livreurRequest.getRib());
		livreur.setAddress(livreurRequest.getAddress());
		livreur.setCity(livreurRequest.getCity());
		livreur.setEmail(livreurRequest.getEmail());
		System.out.println("password" + livreurRequest.getPassword());
		livreur.setPassword(passwordEncoder.encode(livreurRequest.getPassword()));
		livreur.setRole(Role.LIVREUR);
		return livreur;
	}

	public Client mapToClient(RegisterRequest registerRequest) {
		Client client = new Client();

		client.setUsername(registerRequest.getUsername());
		client.setFirstName(registerRequest.getFirstName());
		client.setLastName(registerRequest.getLastName());
		client.setGender(registerRequest.isGender());
		client.setImageProfile(registerRequest.getImageProfile());
		client.setAddress(registerRequest.getAddress());
		client.setPhone(registerRequest.getNumero());
		client.setEmail(registerRequest.getEmail());

		client.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
		client.setRole(Role.CLIENT);
		client.setEmailVerified(false);
		return client;
	}

	public void emailPassword(Long id) {
		Optional<User> optionalUser = userRepository.findById(id);
		if (optionalUser.isPresent()) {
			User user = optionalUser.get();
			mailService.sendMail(new NotificationEmail("Changer mot de passe", user.getEmail(),
					"Pour changer le mot de passe de votre compts clique sur ce lien : http://localhost:3000/front/changePassword/"
							+ user.getId()));
		} else {
			throw new MasterException("User introuvable", HttpStatus.FOUND);
		}
	}

	public void changerPassword(Long id, String password) {
		Optional<User> optionalUser = userRepository.findById(id);
		if (optionalUser.isPresent()) {
			User user = optionalUser.get();
			user.setPassword(passwordEncoder.encode(password));
			userRepository.save(user);
			throw new MasterException("Votre email modifier avec succes", HttpStatus.OK);
		} else {
			throw new MasterException("User introuvable", HttpStatus.OK);
		}
	}

	public void changePasswordByEmail(String email) {
		Optional<User> optionalUser = userRepository.findByEmail(email);
		if (optionalUser.isPresent()) {
			User user = optionalUser.get();
			mailService.sendMail(new NotificationEmail("Changer mot de passe", user.getEmail(),
					"Pour changer le mot de passe de votre compts clique sur ce lien : http://localhost:3000/front/changePassword/"
							+ user.getId()));
		} else {
			throw new MasterException("User introuvable", HttpStatus.FOUND);
		}
	}

}
