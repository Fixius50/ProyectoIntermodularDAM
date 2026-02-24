package com.example.backend.dto;

import lombok.Data;

/**
 * Payload representing an action performed by a player during a battle.
 * Expected to be received through RSocket channels.
 */
@Data
public class BattleAction {

    // Identifier of the room where the action is happening
    private String sessionId;

    // Identifier of the player executing the action
    private Long playerId;

    // Type of action: "ATTACK_CANTO", "ATTACK_VUELO", "DEFEND"
    private String actionType;

    // Amount of seeds (mana) spent on this action
    private int seedsSpent;
}
