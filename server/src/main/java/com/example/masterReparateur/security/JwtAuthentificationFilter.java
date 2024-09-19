package com.example.masterReparateur.security;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class JwtAuthentificationFilter extends OncePerRequestFilter {

	@Autowired
	private JwtProvider jwtProvider;
	@Autowired
	private UserDetailsService userDetailsService;

	@Override
	protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
			throws ServletException, IOException {
		String jwt = getJwtFromRequest(req);

		if (StringUtils.hasText(jwt) && jwtProvider.validateToken(jwt)) {
			String username = jwtProvider.getUsernameFromJwt(jwt);

			UserDetails userDetails = userDetailsService.loadUserByUsername(username);
			UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails,
					null, userDetails.getAuthorities());
			authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));

			SecurityContextHolder.getContext().setAuthentication(authentication);
		}
		chain.doFilter(req, res);
	}

	private String getJwtFromRequest(HttpServletRequest req) {
		String bearerToken = req.getHeader("Authorization");
		if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
			return bearerToken.substring(7);
		}
		return bearerToken;
	}

}
