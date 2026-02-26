package com.avis.backend.repository;

import com.avis.backend.domain.BirdCard;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import java.util.UUID;

@Repository
public interface BirdCardRepository extends R2dbcRepository<BirdCard, UUID> {

    Flux<BirdCard> findByUserId(UUID userId);

}

