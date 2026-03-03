package com.intermodular.server.repository;

import com.intermodular.server.model.Post;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

import java.util.UUID;

@Repository
public interface PostRepository extends ReactiveCrudRepository<Post, UUID> {

    @Query("SELECT * FROM posts ORDER BY created_at DESC LIMIT 50")
    Flux<Post> findLatestPosts();
}
