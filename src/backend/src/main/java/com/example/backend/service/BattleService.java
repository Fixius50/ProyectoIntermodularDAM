package com.example.backend.service;

import com.example.backend.domain.BattleSession;
import com.example.backend.dto.BattleAction;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service handling the business logic for real-time bird battles.
 * Currently uses an in-memory ConcurrentHashMap to store active sessions.
 * In production, this should be replaced with Spring Data Redis for high
 * availability.
 */
@Service
public class BattleService {

    // Thread-safe map storing ongoing battles by sessionId
    private final Map<String, BattleSession> activeBattles = new ConcurrentHashMap<>();

    private final EventPublisherService eventPublisherService;

    public BattleService(EventPublisherService eventPublisherService) {
        this.eventPublisherService = eventPublisherService;
    }

    /**
     * Creates a new battle session waiting for a second player.
     */
    public Mono<BattleSession> createMatch(UUID hostPlayerId, UUID birdCardId) {
        // Base health for testing purposes (could be retrieved from the DB Card)
        int defaultHealth = 100;
        BattleSession session = BattleSession.createRoom(hostPlayerId, birdCardId, defaultHealth);
        activeBattles.put(session.getSessionId(), session);
        return Mono.just(session);
    }

    /**
     * Joins an existing battle session.
     */
    public Mono<BattleSession> joinMatch(String sessionId, UUID guestPlayerId, UUID birdCardId) {
        BattleSession session = activeBattles.get(sessionId);
        if (session == null) {
            return Mono.error(new IllegalArgumentException("Battle session not found"));
        }
        if (session.getPlayerTwoId() != null) {
            return Mono.error(new IllegalStateException("Session is already full"));
        }

        session.setPlayerTwoId(guestPlayerId);
        session.setPlayerTwoBirdCardId(birdCardId);
        session.setPlayerTwoHealth(100);
        session.setStatus("IN_PROGRESS");

        return Mono.just(session);
    }

    /**
     * Processes a battle action asynchronously.
     * Decreases opponent life depending on the action type.
     */
    public Mono<BattleSession> processAction(BattleAction action) {
        BattleSession session = activeBattles.get(action.getSessionId());

        if (session == null || !"IN_PROGRESS".equals(session.getStatus())) {
            return Mono.error(new IllegalStateException("Invalid or inactive session"));
        }

        boolean isPlayerOne = action.getPlayerId().equals(session.getPlayerOneId());

        // Pseudo-logic: calculate damage. Using seeds spent as multiplier.
        // Base damage is 10 * seeds. Reduced by defense (simplistic).
        int baseDamage = action.getSeedsSpent() * 20;
        int defense = 5; // Placeholder for bird stats
        int damage = Math.max(0, baseDamage - defense);

        if (isPlayerOne) {
            session.setPlayerTwoHealth(Math.max(0, session.getPlayerTwoHealth() - damage));
            checkWinner(session);
        } else {
            session.setPlayerOneHealth(Math.max(0, session.getPlayerOneHealth() - damage));
            checkWinner(session);
        }

        return Mono.just(session);
    }

    private void checkWinner(BattleSession session) {
        if (session.getPlayerOneHealth() <= 0) {
            session.setStatus("FINISHED");
            session.setWinnerId(session.getPlayerTwoId());
            // Fire event to RabbitMQ
            eventPublisherService.publishBattleReward(session.getWinnerId(), 50);
        } else if (session.getPlayerTwoHealth() <= 0) {
            session.setStatus("FINISHED");
            session.setWinnerId(session.getPlayerOneId());
            // Fire event to RabbitMQ
            eventPublisherService.publishBattleReward(session.getWinnerId(), 50);
        }
    }
}
