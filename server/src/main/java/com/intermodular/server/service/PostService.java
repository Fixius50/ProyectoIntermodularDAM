package com.intermodular.server.service;

import com.intermodular.server.model.Post;
import com.intermodular.server.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;

    public Flux<Post> getFeed() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    public Mono<Post> createPost(UUID playerId, String text, String imageUrl, String location, UUID birdId) {
        Post post = Post.builder()
                .id(UUID.randomUUID())
                .playerId(playerId)
                .text(text)
                .imageUrl(imageUrl)
                .location(location)
                .birdId(birdId)
                .createdAt(OffsetDateTime.now())
                .build();
        return postRepository.save(post);
    }
}
