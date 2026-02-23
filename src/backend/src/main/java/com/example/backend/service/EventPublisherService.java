package com.example.backend.service;

import com.example.backend.dto.RewardEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

/**
 * Publisher service handling generic message brokering to RabbitMQ.
 * Centralizes the fire-and-forget events dispatched from the main threads.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EventPublisherService {

    private final RabbitTemplate rabbitTemplate;

    // Target Queue definition (would be created in a RabbitMQ config class
    // normally)
    public static final String REWARD_QUEUE = "battle.rewards.queue";

    /**
     * Publishes a winning reward event to the message broker.
     */
    public void publishBattleReward(Long winnerId, int seedsEarned) {
        RewardEvent event = RewardEvent.builder()
                .winnerId(winnerId)
                .seedsGained(seedsEarned)
                .build();

        rabbitTemplate.convertAndSend(REWARD_QUEUE, event);
        log.info("Published RewardEvent to broker for winner {}. Seeds: {}", winnerId, seedsEarned);
    }
}
