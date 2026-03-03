package com.intermodular.server.repository;

import com.intermodular.server.model.PostReaction;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PostReactionRepository extends ReactiveCrudRepository<PostReaction, UUID> {
}
