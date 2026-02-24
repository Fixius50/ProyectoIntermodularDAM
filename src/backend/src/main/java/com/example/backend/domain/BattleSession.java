package com.example.backend.domain;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

/**
 * Represents the volatile state of an ongoing 1v1 battle session.
 * This object is kept in memory (or Redis in the future) for fast RSocket
 * access.
 */
@Data
@Builder
public class BattleSession {

    private String sessionId; // Unique identifier for the room

    private Long playerOneId;
    private Long playerTwoId;

    private Long playerOneBirdCardId;
    private Long playerTwoBirdCardId;

    private int playerOneHealth;
    private int playerTwoHealth;

    // Mana generated to perform actions
    private int playerOneSeeds;
    private int playerTwoSeeds;

    private String status; // WAITING, IN_PROGRESS, FINISHED
    private Long winnerId;

    /**
     * Initializes a new battle room.
     * 
     * @param playerOneId ID of the host player.
     * @return A newly minted BattleSession.
     */
    public static BattleSession createRoom(Long playerOneId, Long playerOneBirdCardId, int initialHealth) {
        return BattleSession.builder()
                .sessionId(UUID.randomUUID().toString())
                .playerOneId(playerOneId)
                .playerOneBirdCardId(playerOneBirdCardId)
                .playerOneHealth(initialHealth)
                .playerOneSeeds(0)
                .status("WAITING")
                .build();
    }
}
