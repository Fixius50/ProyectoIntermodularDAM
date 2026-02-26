package com.intermodular.server.service;

import com.intermodular.server.model.BirdCard;
import com.intermodular.server.repository.BirdCardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BirdCardService {

    private final BirdCardRepository repository;

    public Flux<BirdCard> findAll() {
        return repository.findAll();
    }

    // Usamos el id como key en la cache de redis "bird_stats"
    @Cacheable(value = "bird_stats", key = "#id")
    public Mono<BirdCard> findById(UUID id) {
        return repository.findById(id);
    }

    public Mono<BirdCard> save(BirdCard birdCard) {
        return repository.save(birdCard);
    }
}
