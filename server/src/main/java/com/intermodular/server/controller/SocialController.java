package com.intermodular.server.controller;

import com.intermodular.server.model.Bandada;
import com.intermodular.server.model.Post;
import com.intermodular.server.service.BandadaService;
import com.intermodular.server.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@RequestMapping("/api/social")
@RequiredArgsConstructor
public class SocialController {

    private final BandadaService bandadaService;
    private final PostService postService;

    @GetMapping("/guilds")
    public Flux<Bandada> getAllGuilds() {
        return bandadaService.getAllGuilds();
    }

    @PostMapping("/guilds")
    public Mono<Bandada> createGuild(@RequestBody Bandada bandada) {
        return bandadaService.createGuild(bandada);
    }

    @PostMapping("/guilds/{id}/join")
    public Mono<Void> joinGuild(@PathVariable UUID id, @RequestParam UUID playerId) {
        return bandadaService.joinGuild(id, playerId);
    }

    @GetMapping("/posts")
    public Flux<Post> getFeed() {
        return postService.getGlobalFeed();
    }

    @PostMapping("/posts")
    public Mono<Post> createPost(@RequestBody Post post) {
        return postService.createPost(post);
    }
}
