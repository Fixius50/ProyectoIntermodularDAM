package com.intermodular.server.controller;

import com.intermodular.server.model.Sighting;
import com.intermodular.server.repository.PlayerRepository;
import com.intermodular.server.security.JwtUtil;
import com.intermodular.server.service.SightingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/sightings")
@RequiredArgsConstructor
public class SightingController {

    private final SightingService sightingService;
    private final PlayerRepository playerRepository;
    private final JwtUtil jwtUtil;

    /** GET /api/sightings — avistamientos del jugador autenticado */
    @GetMapping
    public Flux<Sighting> getMySightings(ServerWebExchange exchange) {
        return resolvePlayerId(exchange)
                .flatMapMany(sightingService::getByPlayer);
    }

    /**
     * POST /api/sightings
     * body: { "birdCardId":"uuid", "lat":40.2, "lon":-3.7,
     * "audioUrl":"...", "photoUrl":"...", "notes":"..." }
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<Sighting> register(@RequestBody Map<String, Object> body,
            ServerWebExchange exchange) {
        return resolvePlayerId(exchange).flatMap(pid -> {
            UUID birdCardId = body.get("birdCardId") != null
                    ? UUID.fromString((String) body.get("birdCardId"))
                    : null;
            Double lat = body.get("lat") != null ? ((Number) body.get("lat")).doubleValue() : null;
            Double lon = body.get("lon") != null ? ((Number) body.get("lon")).doubleValue() : null;
            return sightingService.register(
                    pid, birdCardId, lat, lon,
                    (String) body.get("audioUrl"),
                    (String) body.get("photoUrl"),
                    (String) body.get("notes"));
        });
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
