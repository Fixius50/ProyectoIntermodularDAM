package com.avis.backend.controller;

import com.avis.backend.dto.AuthRequest;
import com.avis.backend.dto.AuthResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

/**
 * Controller handling JWT issuance by delegating to Supabase REST Auth.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    @Value("${supabase.url:https://shmutxsmjokamnxrkufe.supabase.co}")
    private String supabaseUrl;

    @Value("${supabase.anon.key:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNobXV0eHNtam9rYW1ueHJrdWZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NTkxMzEsImV4cCI6MjA4NzQzNTEzMX0._Pk4b0EXuosXJO33loxHd3ntxMGUXJooF7TsgpKqIc4}")
    private String supabaseAnonKey;

    private final WebClient webClient = WebClient.builder().build();

    /**
     * Authenticates a user directly against Supabase API.
     */
    @PostMapping("/login")
    public Mono<ResponseEntity<AuthResponse>> login(@RequestBody AuthRequest request) {
        String authUrl = supabaseUrl + "/auth/v1/token?grant_type=password";

        Map<String, String> body = Map.of(
                "email", request.getUsername(),
                "password", request.getPassword());

        log.info("Attempting login to Supabase for user: {}", request.getUsername());

        return webClient.post()
                .uri(authUrl)
                .header("apikey", supabaseAnonKey)
                .header("Content-Type", "application/json")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(Map.class)
                .map(responseMap -> {
                    String token = (String) responseMap.get("access_token");
                    log.info("Login successful for {}", request.getUsername());
                    return ResponseEntity.ok(new AuthResponse(token));
                })
                .onErrorResume(e -> {
                    log.error("Login failed: {}", e.getMessage());
                    return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
                });
    }
}

