package com.example.backend.service;

import com.example.backend.dto.AuctionItem;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import java.util.UUID;

public interface MarketplaceService {
    Flux<AuctionItem> getAvailableAuctions();
    Mono<AuctionItem> createAuction(UUID sellerId, UUID birdCardId, int price);
    Mono<AuctionItem> buyItem(String auctionId, UUID buyerId);
}
