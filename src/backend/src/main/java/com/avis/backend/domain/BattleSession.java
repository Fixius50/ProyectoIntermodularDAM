package com.avis.backend.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Represents the state of an active 1v1 battle session.
 * This is stored in-memory for RSocket performance but mirrors
 * a relational structure (Player IDs, Card IDs).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BattleSession {

    private String sessionId; // UUID string identifier for the room

    private UUID playerOneId;
    private UUID playerTwoId;

    private UUID playerOneBirdCardId;
    private UUID playerTwoBirdCardId;

    private int playerOneHealth;
    private int playerTwoHealth;

    private int playerOneSeeds;
    private int playerTwoSeeds;

    private String status; // WAITING, IN_PROGRESS, FINISHED
    private UUID winnerId;

    public static BattleSession createRoom(UUID playerOneId, UUID playerOneBirdCardId, int initialHealth) {
        return BattleSession.builder()
                .sessionId(UUID.randomUUID().toString())
                .playerOneId(playerOneId)
                .playerOneBirdCardId(playerOneBirdCardId)
                .playerOneHealth(initialHealth)
                .playerTwoHealth(initialHealth)
                .playerOneSeeds(0)
                .playerTwoSeeds(0)
                .status("WAITING")
                .build();
    }
}

