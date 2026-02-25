package com.example.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;

/**
 * Represents a BirdCard currently listed in the global marketplace.
 * This entity is designed to be cached in Redis for fast querying.
 */
@Data
@Builder
public class AuctionItem {

    // Unique identifier of the auction listing
    private String auctionId;

    // The ID of the user selling the card
    private UUID sellerId;

    // The specific BirdCard being sold
    private UUID birdCardId;

    // The price in 'semillas' (seeds/currency)
    private int price;

    // Status: AVAILABLE, SOLD, CANCELLED
    private String status;

    // The ID of the user who bought the card (null if not sold)
    private UUID buyerId;
}
