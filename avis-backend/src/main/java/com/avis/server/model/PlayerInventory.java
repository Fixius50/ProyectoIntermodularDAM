package com.avis.server.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.Instant;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table("player_inventory")
public class PlayerInventory {
    @Id
    private UUID id;
    private UUID playerId;
    private UUID birdCardId;
    private Double capturedLat;
    private Double capturedLon;
    private Instant capturedAt;
}
