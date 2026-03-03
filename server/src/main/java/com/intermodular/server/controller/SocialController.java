package com.intermodular.server.controller;
import lombok.RequiredArgsConstructor;

import com.intermodular.server.model.Bandada;
import com.intermodular.server.model.Post;
import com.intermodular.server.service.BandadaService;
import com.intermodular.server.service.PostService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@RequestMapping("/api/social")
@RequiredArgsConstructor
@Slf4j
public class SocialController {

    private final BandadaService bandadaService;
    private final PostService postService;

    @GetMapping("/guilds")
    public Flux<Bandada> getAllGuilds() {
        log.info("[SocialController] GET /api/social/guilds - Solicitando lista de bandadas");
        return bandadaService.getAllGuilds();
    }

    @PostMapping("/guilds")
    public Mono<Bandada> createGuild(@RequestBody Bandada bandada) {
        log.info("[SocialController] POST /api/social/guilds - Petición crear bandada: {}", bandada.getNombre());
        return bandadaService.createGuild(bandada);
    }

    @PostMapping("/guilds/{id}/join")
    public Mono<Void> joinGuild(@PathVariable UUID id, @RequestParam UUID playerId) {
        log.info("[SocialController] POST /api/social/guilds/{}/join - Petición jugador {} unirse", id, playerId);
        return bandadaService.joinGuild(id, playerId);
    }

    @GetMapping("/posts")
    public Flux<Post> getFeed() {
        log.info("[SocialController] GET /api/social/posts - Solicitando muro global");
        return postService.getGlobalFeed();
    }

    @PostMapping("/posts")
    public Mono<Post> createPost(@RequestBody Post post) {
        log.info("[SocialController] POST /api/social/posts - Petición crear post");
        return postService.createPost(post);
    }
}
