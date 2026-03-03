package com.intermodular.server.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        return http
            .csrf(ServerHttpSecurity.CsrfSpec::disable) // Desactivar CSRF (típico en APIs REST)
            .formLogin(ServerHttpSecurity.FormLoginSpec::disable) // Quitar el formulario HTML por defecto
            .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable) // Quitar la ventanita emergente de login
            .authorizeExchange(exchanges -> exchanges
                .pathMatchers(HttpMethod.OPTIONS).permitAll() // Dejar pasar las peticiones del navegador/app (CORS)
                .pathMatchers("/api/auth/**").permitAll()     // Vía libre para Registrarse y Loguearse
                .anyExchange().permitAll()                    // (Temporal) Dejamos todo abierto para que no te bloquee otras pruebas
            )
            .build();
    }
}
