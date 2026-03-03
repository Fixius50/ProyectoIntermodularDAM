package com.intermodular.server.controller;

import com.intermodular.server.model.Post;
import com.intermodular.server.model.SocialComment;
import com.intermodular.server.repository.CommentRepository;
import com.intermodular.server.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:5173", "capacitor://localhost" })
public class PostController {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;

    @GetMapping
    public Flux<Post> getAllPosts() {
        return postRepository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<Post> createPost(@RequestBody Post post) {
        post.setId(UUID.randomUUID());
        post.setCreatedAt(LocalDateTime.now());
        if (post.getLikes() == null)
            post.setLikes(0);
        if (post.getCommentsCount() == null)
            post.setCommentsCount(0);
        if (post.getReactions() == null)
            post.setReactions("{}");
        return postRepository.save(post);
    }

    @PostMapping("/{id}/react")
    public Mono<Post> reactToPost(@PathVariable UUID id, @RequestParam String reaction) {
        return postRepository.findById(id)
                .flatMap(post -> {
                    // Logic to update reactions JSON string
                    // This is a simplified version
                    post.setLikes(post.getLikes() + 1);
                    return postRepository.save(post);
                });
    }

    @PostMapping("/{id}/comment")
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<SocialComment> addComment(@PathVariable UUID id, @RequestBody SocialComment comment) {
        comment.setId(UUID.randomUUID());
        comment.setPostId(id);
        comment.setTimestamp(LocalDateTime.now());

        return commentRepository.save(comment)
                .flatMap(savedComment -> postRepository.findById(id)
                        .flatMap(post -> {
                            post.setCommentsCount(post.getCommentsCount() + 1);
                            return postRepository.save(post).thenReturn(savedComment);
                        }));
    }

    @GetMapping("/{id}/comments")
    public Flux<SocialComment> getComments(@PathVariable UUID id) {
        return commentRepository.findByPostId(id);
    }
}
