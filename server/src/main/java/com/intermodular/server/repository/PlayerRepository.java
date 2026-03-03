package com.intermodular.server.repository;

import com.intermodular.server.model.Player;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Repository
public interface PlayerRepository extends ReactiveCrudRepository<Player, UUID> {
    // Buscamos por username porque no hay email en la base de datos
    Mono<Player> findByUsername(String username);
}
