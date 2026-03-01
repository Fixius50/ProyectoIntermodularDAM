package com.intermodular.server.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/public")
public class HealthController {

    @GetMapping("/health")
    public Mono<Map<String, String>> health() {
        return Mono.just(Map.of("status", "UP", "version", "1.0.0"));
    }

    @GetMapping("/tailscale")
    public Mono<Map<String, String>> tailscaleStatus() {
        return Mono.fromCallable(() -> {
            try {
                Process p = new ProcessBuilder("tailscale", "ip", "-4").start();
                try (java.io.BufferedReader r = new java.io.BufferedReader(
                        new java.io.InputStreamReader(p.getInputStream()))) {
                    String ip = r.readLine();
                    return Map.of("active", "true", "ip", ip != null ? ip : "unknown");
                }
            } catch (Exception e) {
                return Map.of("active", "false", "error", e.getMessage());
            }
        });
    }
}
