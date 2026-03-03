package com.intermodular.server.repository;

import com.intermodular.server.model.SocialComment;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

import java.util.UUID;

@Repository
public interface CommentRepository extends ReactiveCrudRepository<SocialComment, UUID> {
    Flux<SocialComment> findByPostId(UUID postId);
}
