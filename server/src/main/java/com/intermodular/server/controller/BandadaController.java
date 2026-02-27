package com.intermodular.server.controller;

import com.intermodular.server.model.Bandada;
import com.intermodular.server.repository.PlayerRepository;
import com.intermodular.server.security.JwtUtil;
import com.intermodular.server.service.BandadaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/bandadas")
@RequiredArgsConstructor
public class BandadaController {

    private final BandadaService bandadaService;
    private final PlayerRepository playerRepository;
    private final JwtUtil jwtUtil;

    /** GET /api/bandadas */
    @GetMapping
    public Flux<Bandada> list() {
        return bandadaService.findAll();
    }

    /** POST /api/bandadas body: { "nombre":"...", "descripcion":"..." } */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<Bandada> create(@RequestBody Map<String, String> body,
            ServerWebExchange exchange) {
        return resolvePlayerId(exchange)
                .flatMap(pid -> bandadaService.create(
                        body.get("nombre"),
                        body.get("descripcion"),
                        pid));
    }

    /** PUT /api/bandadas/{id}/join */
    @PutMapping("/{id}/join")
    public Mono<Void> join(@PathVariable UUID id, ServerWebExchange exchange) {
        return resolvePlayerId(exchange)
                .flatMap(pid -> bandadaService.joinMember(id, pid));
    }

    private Mono<UUID> resolvePlayerId(ServerWebExchange exchange) {
        String auth = exchange.getRequest().getHeaders().getFirst("Authorization");
        if (auth == null || !auth.startsWith("Bearer ")) {
            return Mono.error(new IllegalArgumentException("Token requerido."));
        }
        String username = jwtUtil.getUsernameFromToken(auth.substring(7));
        return playerRepository.findByUsername(username)
                .map(p -> p.getId())
                .switchIfEmpty(Mono.error(new IllegalArgumentException("Jugador no encontrado.")));
    }
}
