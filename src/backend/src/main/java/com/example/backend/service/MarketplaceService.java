package com.example.backend.service;

import com.example.backend.dto.AuctionItem;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service managing the Social Marketplace where players can buy and sell
 * BirdCards.
 * Utilizes a ConcurrentHashMap to simulate Redis caching and distributed locks
 * for now.
 */
@Service
@Slf4j
public class MarketplaceService {

    // Simulating a Redis Hash for active auctions
    private final Map<String, AuctionItem> activeAuctions = new ConcurrentHashMap<>();

    /**
     * Lists a new BirdCard on the marketplace.
     */
    public Mono<AuctionItem> createAuction(Long sellerId, Long birdCardId, int price) {
        AuctionItem item = AuctionItem.builder()
                .auctionId(UUID.randomUUID().toString())
                .sellerId(sellerId)
                .birdCardId(birdCardId)
                .price(price)
                .status("AVAILABLE")
                .build();

        activeAuctions.put(item.getAuctionId(), item);
        log.info("New auction created: {} by seller {}", item.getAuctionId(), sellerId);

        return Mono.just(item);
    }

    /**
     * Retrieves all currently available auctions as a reactive stream.
     */
    public Flux<AuctionItem> getAvailableAuctions() {
        return Flux.fromIterable(activeAuctions.values())
                .filter(item -> "AVAILABLE".equals(item.getStatus()));
    }

    /**
     * Attempts to mutually exclusively purchase an item.
     * In a production environment with Redis, we would acquire a Redisson lock here
     * to prevent race conditions if two players buy exactly at the same
     * millisecond.
     */
    public Mono<AuctionItem> buyItem(String auctionId, Long buyerId) {
        return Mono.defer(() -> {
            AuctionItem item = activeAuctions.get(auctionId);

            if (item == null) {
                return Mono.error(new IllegalArgumentException("Auction does not exist."));
            }

            // Critical section simulation
            synchronized (item) {
                if (!"AVAILABLE".equals(item.getStatus())) {
                    log.warn("Buyer {} attempted to buy already sold item {}", buyerId, auctionId);
                    return Mono.error(new IllegalStateException("Item is no longer available."));
                }

                // Process payment and transfer logic would go here

                item.setStatus("SOLD");
                log.info("Item {} successfully bought by {}", auctionId, buyerId);
            }

            return Mono.just(item);
        });
    }
}
