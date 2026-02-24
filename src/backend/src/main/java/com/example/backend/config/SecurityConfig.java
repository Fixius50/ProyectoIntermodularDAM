package com.example.backend.config;

import com.example.backend.security.JwtAuthenticationManager;
import com.example.backend.security.JwtSecurityContextRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import reactor.core.publisher.Mono;

/**
 * WebFlux Security configuration enabling stateless JWT authentication.
 */
@Configuration
@EnableWebFluxSecurity
@RequiredArgsConstructor
public class SecurityConfig {

        private final JwtAuthenticationManager authenticationManager;
        private final JwtSecurityContextRepository securityContextRepository;

        @Bean
        public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
                return http
                                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                                .cors(ServerHttpSecurity.CorsSpec::disable) // Desactivar CORS temporalmente para
                                                                            // pruebas
                                .formLogin(ServerHttpSecurity.FormLoginSpec::disable)
                                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
                                .authenticationManager(authenticationManager)
                                .securityContextRepository(securityContextRepository)
                                .authorizeExchange(exchanges -> exchanges
                                                .pathMatchers(HttpMethod.OPTIONS).permitAll() // Allow CORS preflight
                                                .pathMatchers(HttpMethod.POST, "/api/auth/login", "/api/auth/**")
                                                .permitAll() // Expose Auth explicitly for POST
                                                .pathMatchers(HttpMethod.GET, "/pruebaConexion.txt").permitAll() // Permit
                                                                                                                 // connection
                                                                                                                 // test
                                                                                                                 // file
                                                                                                                 // explicitly
                                                .pathMatchers("/api/auth/**").permitAll() // Expose all other Auth
                                                                                          // endpoints
                                                // endpoints and testing file
                                                .anyExchange().authenticated() // Secure all other APIs
                                )
                                // Return 401 instead of redirecting to login page when unauthorized
                                .exceptionHandling(exceptionHandling -> exceptionHandling
                                                .authenticationEntryPoint((swe, e) -> Mono
                                                                .fromRunnable(() -> swe.getResponse().setStatusCode(
                                                                                HttpStatus.UNAUTHORIZED)))
                                                .accessDeniedHandler((swe, e) -> Mono
                                                                .fromRunnable(() -> swe.getResponse()
                                                                                .setStatusCode(HttpStatus.FORBIDDEN))))
                                .build();
        }
}
