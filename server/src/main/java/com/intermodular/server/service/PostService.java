package com.intermodular.server.service;

import com.intermodular.server.model.Post;
import com.intermodular.server.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.ZonedDateTime;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;

    public Flux<Post> getGlobalFeed() {
        return postRepository.findLatestPosts();
    }

    public Mono<Post> createPost(Post post) {
        post.setCreatedAt(ZonedDateTime.now());
        return postRepository.save(post);
    }
}
