package com.intermodular.server.service;

import com.intermodular.server.model.Sighting;
import com.intermodular.server.repository.SightingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SightingService {

    private final SightingRepository sightingRepository;

    public Flux<Sighting> getByPlayer(UUID playerId) {
        return sightingRepository.findByPlayerId(playerId);
    }

    public Mono<Sighting> register(UUID playerId, UUID birdCardId,
            Double lat, Double lon,
            String audioUrl, String photoUrl, String notes) {
        Sighting s = Sighting.builder()
                .id(UUID.randomUUID())
                .playerId(playerId)
                .birdCardId(birdCardId)
                .lat(lat)
                .lon(lon)
                .audioUrl(audioUrl)
                .photoUrl(photoUrl)
                .notes(notes)
                .sightedAt(OffsetDateTime.now())
                .build();
        return sightingRepository.save(s);
    }
}
