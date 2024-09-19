package com.example.masterReparateur.security;

import java.io.IOException;
import java.io.InputStream;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateException;

import java.time.Instant;
import java.util.Date;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

import com.example.masterReparateur.exception.MasterException;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

@Service
public class JwtProvider {
	private KeyStore keyStore;
	@Value("${jwt.expiration.time}")
	private Long jwtExpireInMillis;

	@PostConstruct
	public void init() {
		try {
			keyStore = KeyStore.getInstance("JKS");
			InputStream ressourceAsStream = getClass().getResourceAsStream("/springblog.jks");
			keyStore.load(ressourceAsStream, "secret".toCharArray());
		} catch (KeyStoreException | CertificateException | NoSuchAlgorithmException | IOException e) {
			throw new MasterException("Exception occured while loading keystore", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public String generateToken(Authentication authentication) {
		User prinsipal = (User) authentication.getPrincipal();
		return Jwts.builder().setSubject(prinsipal.getUsername()).signWith(getPrivateKey())
				.setExpiration(Date.from(Instant.now().plusMillis(jwtExpireInMillis))).compact();
	}

	public String generateTokenWithUserName(String username) {
		return Jwts.builder().setSubject(username).setIssuedAt(Date.from(Instant.now())).signWith(getPrivateKey())
				.setExpiration(Date.from(Instant.now().plusMillis(jwtExpireInMillis))).compact();
	}

	private PrivateKey getPrivateKey() {
		try {
			return (PrivateKey) keyStore.getKey("springblog", "secret".toCharArray());
		} catch (KeyStoreException | NoSuchAlgorithmException | UnrecoverableKeyException e) {
			throw new MasterException("Exception occured while retreiving public key from keystore",
					HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public boolean validateToken(String jwt) {
		Jwts.parser().setSigningKey(getPublickey()).parseClaimsJws(jwt);
		return true;
	}

	private PublicKey getPublickey() {
		try {
			return keyStore.getCertificate("springblog").getPublicKey();
		} catch (KeyStoreException e) {
			throw new MasterException("Exception occured while " + "retrieving public key from keystore",
					HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public String getUsernameFromJwt(String token) {
		Claims claims = Jwts.parser().setSigningKey(getPublickey()).parseClaimsJws(token).getBody();

		return claims.getSubject();
	}

	public Long getJwtExpireInMillis() {
		return jwtExpireInMillis;
	}
}
