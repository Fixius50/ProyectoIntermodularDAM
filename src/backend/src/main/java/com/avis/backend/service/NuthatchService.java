package com.avis.backend.service;

import com.avis.backend.domain.BirdRecord;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class NuthatchService {

    private final WebClient webClient;

    public NuthatchService(WebClient.Builder webClientBuilder, 
                           @Value("${avis.nuthatch.api-key:NO_KEY}") String apiKey) {
        this.webClient = webClientBuilder
                .baseUrl("https://nuthatch.lastelm.software/v2")
                .defaultHeader("api-key", apiKey)
                .build();
    }

    public Flux<BirdRecord> getBirds() {
        return webClient.get()
                .uri("/birds")
                .retrieve()
                .bodyToFlux(BirdRecord.class);
    }

    public Mono<BirdRecord> getBirdById(Integer id) {
        return webClient.get()
                .uri("/birds/{id}", id)
                .retrieve()
                .bodyToMono(BirdRecord.class);
    }
}

