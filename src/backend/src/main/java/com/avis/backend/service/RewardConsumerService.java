package com.avis.backend.service;

import com.avis.backend.dto.RewardEvent;
import com.avis.backend.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

/**
 * Consumer service listening to RabbitMQ queues for background processing.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RewardConsumerService {

    private final InventoryRepository inventoryRepository;

    /**
     * Listens to the reward queue. Retrieves the user's inventory and
     * asynchronously adds seeds.
     * Uses block() since RabbitMQ listener is blocking by nature in standard AMQP
     * (though it can be optimized with Reactor RabbitMQ).
     */
    @RabbitListener(queues = EventPublisherService.REWARD_QUEUE)
    public void receiveRewardEvent(RewardEvent event) {
        log.info("Received RewardEvent from broker for winner {}. Processing reward...", event.getWinnerId());

        inventoryRepository.findByUserId(event.getWinnerId())
                .flatMap(inventory -> {
                    inventory.setSemillas(inventory.getSemillas() + event.getSeedsGained());
                    return inventoryRepository.save(inventory);
                })
                .doOnSuccess(saved -> log.info("Successfully added {} seeds to player {}", event.getSeedsGained(),
                        event.getWinnerId()))
                .doOnError(err -> log.error("Failed to process reward for player {}: {}", event.getWinnerId(),
                        err.getMessage()))
                .subscribe(); // Subscribe to trigger the reactive flow from the blocking listener thread
    }
}

