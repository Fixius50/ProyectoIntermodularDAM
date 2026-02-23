package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * Event payload dispatched to RabbitMQ when a user wins a battle.
 * Needs to implement Serializable for message conversion across the broker.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RewardEvent implements Serializable {

    // Identifier of the winner
    private Long winnerId;

    // Total seeds awarded from the combat pool
    private int seedsGained;

}
