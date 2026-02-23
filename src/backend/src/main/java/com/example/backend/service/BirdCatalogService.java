package com.example.backend.service;

import com.example.backend.domain.BirdRecord;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class BirdCatalogService {

    private final WebClient webClient;
    private final String catalogUrl;

    public BirdCatalogService(WebClient.Builder webClientBuilder,
            @Value("${avis.catalog.url}") String catalogUrl) {
        this.webClient = webClientBuilder.build();
        this.catalogUrl = catalogUrl;
    }

    /**
     * Recupera todos los pájaros del catálogo remoto.
     */
    public Flux<BirdRecord> getAllBirds() {
        return webClient.get()
                .uri(catalogUrl)
                .retrieve()
                .bodyToFlux(BirdRecord.class);
    }

    /**
     * Busca un pájaro específico por su ID tras descargar el catálogo.
     */
    public Mono<BirdRecord> getBirdById(Long id) {
        return getAllBirds()
                .filter(bird -> id.equals(bird.getId()))
                .next();
    }
}
