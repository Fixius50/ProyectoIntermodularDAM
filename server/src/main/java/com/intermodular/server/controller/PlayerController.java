package com.intermodular.server.controller;

import com.intermodular.server.model.Player;
import com.intermodular.server.repository.PlayerRepository;
import com.intermodular.server.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/players")
@RequiredArgsConstructor
public class PlayerController {

    private final PlayerRepository playerRepository;
    private final JwtUtil jwtUtil;

    /** GET /api/players/me — perfil del jugador autenticado */
    @GetMapping("/me")
    public Mono<Map<String, Object>> getMe(ServerWebExchange exchange) {
        return resolvePlayer(exchange).map(this::toDto);
    }

    /** PUT /api/players/me — actualiza feathers/xp/level */
    @PutMapping("/me")
    public Mono<Map<String, Object>> updateMe(@RequestBody Map<String, Integer> body,
            ServerWebExchange exchange) {
        return resolvePlayer(exchange).flatMap(player -> {
            if (body.containsKey("feathers"))
                player.setFeathers(body.get("feathers"));
            if (body.containsKey("xp"))
                player.setExperience(body.get("xp"));
            if (body.containsKey("level"))
                player.setLevel(body.get("level"));
            return playerRepository.save(player);
        }).map(this::toDto);
    }

    private Mono<Player> resolvePlayer(ServerWebExchange exchange) {
        String auth = exchange.getRequest().getHeaders().getFirst("Authorization");
        if (auth == null || !auth.startsWith("Bearer ")) {
            return Mono.error(new IllegalArgumentException("Token JWT requerido."));
        }
        String username = jwtUtil.getUsernameFromToken(auth.substring(7));
        return playerRepository.findByUsername(username)
                .switchIfEmpty(Mono.error(new IllegalArgumentException("Jugador no encontrado.")));
    }

    private Map<String, Object> toDto(Player p) {
        return Map.of(
                "id", p.getId().toString(),
                "username", p.getUsername(),
                "level", p.getLevel(),
                "xp", p.getExperience(),
                "feathers", p.getFeathers());
    }
}
