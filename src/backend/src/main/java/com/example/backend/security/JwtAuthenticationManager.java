package com.example.backend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.Collections;

/**
 * Validates the provided Authentication token (which is a JWT in our case).
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationManager implements ReactiveAuthenticationManager {

    private final JwtUtil jwtUtil;

    @Override
    public Mono<Authentication> authenticate(Authentication authentication) {
        String authToken = authentication.getCredentials().toString();

        try {
            if (jwtUtil.validateToken(authToken)) {
                String username = jwtUtil.extractUsername(authToken);
                // In a real app we might fetch the user roles from DB here, but to keep it fast
                // we grant a default ROLE_USER to anyone with a valid token
                return Mono.just(new UsernamePasswordAuthenticationToken(
                        username,
                        authToken,
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))));
            } else {
                return Mono.empty();
            }
        } catch (Exception e) {
            return Mono.empty();
        }
    }
}
