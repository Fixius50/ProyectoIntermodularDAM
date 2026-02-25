package com.avis.backend.controller;

import com.avis.backend.dto.AuctionItem;
import com.avis.backend.service.MarketplaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import java.util.UUID;

/**
 * Reactive REST Controller exposing the marketplace functionality.
 * Designed to interact efficiently with frontend requests via
 * HTTP/Server-Sent-Events.
 */
@RestController
@RequestMapping("/api/marketplace")
@RequiredArgsConstructor
public class MarketplaceController {

    private final MarketplaceService marketplaceService;

    @GetMapping("/available")
    public Flux<AuctionItem> getAvailableAuctions() {
        return marketplaceService.getAvailableAuctions();
    }

    @PostMapping("/sell")
    public Mono<AuctionItem> createAuction(@RequestParam UUID sellerId,
            @RequestParam UUID birdCardId,
            @RequestParam int price) {
        return marketplaceService.createAuction(sellerId, birdCardId, price);
    }

    @PostMapping("/buy/{auctionId}")
    public Mono<AuctionItem> buyItem(@PathVariable String auctionId,
            @RequestParam UUID buyerId) {
        return marketplaceService.buyItem(auctionId, buyerId);
    }
}

