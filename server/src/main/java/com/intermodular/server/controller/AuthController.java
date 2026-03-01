package com.intermodular.server.controller;

import com.intermodular.server.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    /** POST /api/auth/register body: { "username":"...", "password":"..." } */
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<Map<String, Object>> register(@RequestBody Map<String, String> body) {
        log.info("[API] Intento de registro recibido para usuario: {}", body.get("username"));
        return authService.register(body.get("username"), body.get("password"))
                .onErrorResume(e -> {
                    return Mono.error(new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                            "BACKEND_ERR: " + e.getMessage(), e));
                });
    }

    /** POST /api/auth/login body: { "username":"...", "password":"..." } */
    @PostMapping("/login")
    public Mono<Map<String, Object>> login(@RequestBody Map<String, String> body) {
        return authService.login(body.get("username"), body.get("password"))
                .onErrorResume(e -> {
                    return Mono.error(
                            new ResponseStatusException(HttpStatus.UNAUTHORIZED, "BACKEND_ERR: " + e.getMessage(), e));
                });
    }
}
