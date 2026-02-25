package com.avis.backend.controller;

import com.avis.backend.domain.BirdCard;
import com.avis.backend.dto.CraftingRequest;
import com.avis.backend.service.CraftingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/crafting")
@RequiredArgsConstructor
public class CraftingController {

    private final CraftingService craftingService;

    @PostMapping("/forge")
    public Mono<BirdCard> forgeBirdStation(@RequestBody CraftingRequest request) {
        return craftingService.craftBird(request);
    }
}

