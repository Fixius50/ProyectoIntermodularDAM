package com.example.backend.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
public class TestConnectionController {

    @GetMapping("/pruebaConexion.txt")
    public Mono<ResponseEntity<String>> getPruebaConexion() {
        return Mono.just(ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, "text/plain")
                .body("Conexión exitosa al backend vía Tailscale!"));
    }
}
