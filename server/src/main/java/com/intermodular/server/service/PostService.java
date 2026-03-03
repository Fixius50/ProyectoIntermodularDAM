package com.intermodular.server.service;

import com.intermodular.server.model.Post;
import com.intermodular.server.repository.PostRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.ZonedDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class PostService {

    private final PostRepository postRepository;

    public Flux<Post> getGlobalFeed() {
        log.info("[PostService] Obteniendo el feed global de posts");
        return postRepository.findLatestPosts()
                .doOnError(e -> log.error("[PostService] Error obteniendo feed global: {}", e.getMessage()));
    }

    public Mono<Post> createPost(Post post) {
        log.info("[PostService] Solicitud para crear un nuevo post por el usuario: {}", post.getUserId());
        post.setCreatedAt(ZonedDateTime.now());
        return postRepository.save(post)
                .doOnSuccess(saved -> log.info("[PostService] Post creado exitosamente con ID: {}", saved.getId()))
                .doOnError(e -> log.error("[PostService] Error al crear post: {}", e.getMessage()));
    }
}
