package com.intermodular.server.controller;

import com.intermodular.server.model.BirdCard;
import com.intermodular.server.service.BirdCardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@RequestMapping("/api/public/birds")
@RequiredArgsConstructor
public class BirdController {

    private final BirdCardService birdCardService;

    @GetMapping
    public Flux<BirdCard> getAllBirds() {
        return birdCardService.findAll();
    }

    @GetMapping("/{id}")
    public Mono<BirdCard> getBirdById(@PathVariable UUID id) {
        return birdCardService.findById(id);
    }

    // Solo como ejemplo de creacion en endpoints publicos
    @PostMapping
    public Mono<BirdCard> createBird(@RequestBody BirdCard birdCard) {
        if (birdCard.getId() == null) {
            birdCard.setId(UUID.randomUUID());
        }
        return birdCardService.save(birdCard);
    }
}
