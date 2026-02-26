package com.avis.backend.controller;

import com.avis.backend.domain.BirdRecord;
import com.avis.backend.service.BirdCatalogService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/birds")
@RequiredArgsConstructor
public class BirdCatalogController {

    private final BirdCatalogService birdCatalogService;

    @GetMapping
    public Flux<BirdRecord> getAllBirds() {
        return birdCatalogService.getAllBirds();
    }

    @GetMapping("/{id}")
    public Mono<BirdRecord> getBirdById(@PathVariable Long id) {
        return birdCatalogService.getBirdById(id);
    }
}

