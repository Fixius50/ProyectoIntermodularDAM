package com.intermodular.server.controller;

import com.intermodular.server.model.Post;
import com.intermodular.server.repository.PlayerRepository;
import com.intermodular.server.security.JwtUtil;
import com.intermodular.server.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final PlayerRepository playerRepository;
    private final JwtUtil jwtUtil;

    /** GET /api/posts — feed público paginado */
    @GetMapping
    public Flux<Post> getFeed() {
        return postService.getFeed();
    }

    /** POST /api/posts — crear post (requiere JWT) */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<Post> createPost(@RequestBody Map<String, String> body,
            ServerWebExchange exchange) {
        return resolvePlayerId(exchange)
                .flatMap(playerId -> postService.createPost(
                        playerId,
                        body.get("text"),
                        body.get("imageUrl"),
                        body.get("location"),
                        body.get("birdId") != null ? UUID.fromString(body.get("birdId")) : null));
    }

    /** Helper: extrae el playerId del JWT → busca player en BD */
    private Mono<UUID> resolvePlayerId(ServerWebExchange exchange) {
        String authHeader = exchange.getRequest().getHeaders().getFirst("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return Mono.error(new IllegalArgumentException("Token JWT requerido."));
        }
        String username = jwtUtil.getUsernameFromToken(authHeader.substring(7));
        return playerRepository.findByUsername(username)
                .map(p -> p.getId())
                .switchIfEmpty(Mono.error(new IllegalArgumentException("Jugador no encontrado.")));
    }
}
