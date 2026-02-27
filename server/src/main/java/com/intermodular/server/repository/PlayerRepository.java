package com.intermodular.server.repository;

import com.intermodular.server.model.Player;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Repository
public interface PlayerRepository extends R2dbcRepository<Player, UUID> {
    Mono<Player> findByUsername(String username);
}
