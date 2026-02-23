package com.example.backend.repository;

import com.example.backend.domain.BirdCard;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface BirdCardRepository extends R2dbcRepository<BirdCard, Long> {

    Flux<BirdCard> findByUserId(Long userId);

}
