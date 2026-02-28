package com.intermodular.server.repository;

import com.intermodular.server.model.Sighting;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

import java.util.UUID;

@Repository
public interface SightingRepository extends R2dbcRepository<Sighting, UUID> {
    Flux<Sighting> findByPlayerId(UUID playerId);

    Flux<Sighting> findByPlayerIdAndBirdCardId(UUID playerId, UUID birdCardId);
}
