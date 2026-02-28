package com.intermodular.server.repository;

import com.intermodular.server.model.Post;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

import java.util.UUID;

@Repository
public interface PostRepository extends R2dbcRepository<Post, UUID> {
    Flux<Post> findAllByOrderByCreatedAtDesc();
}
