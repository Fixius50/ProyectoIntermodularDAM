package com.intermodular.server.security;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.Collections;

@Component
@AllArgsConstructor
@Slf4j
public class JwtAuthenticationManager implements ReactiveAuthenticationManager {

    private final JwtUtil jwtUtil;

    @Override
    public Mono<Authentication> authenticate(Authentication authentication) {
        String token = authentication.getCredentials().toString();
        log.debug("[JwtAuthenticationManager] Intentando autenticar token...");

        try {
            if (jwtUtil.validateToken(token)) {
                String username = jwtUtil.getUsernameFromToken(token);
                log.info("[JwtAuthenticationManager] Autenticación exitosa para usuario: {}", username);

                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        username,
                        token,
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));
                return Mono.just(auth);
            } else {
                log.warn("[JwtAuthenticationManager] Token inválido o expirado.");
                return Mono.empty();
            }
        } catch (Exception e) {
            log.error("[JwtAuthenticationManager] Error durante la autenticación: {}", e.getMessage());
            return Mono.empty();
        }
    }
}
