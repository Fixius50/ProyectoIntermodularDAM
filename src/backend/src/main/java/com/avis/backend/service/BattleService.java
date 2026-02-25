package com.avis.backend.service;

import com.avis.backend.domain.BattleSession;
import com.avis.backend.dto.BattleAction;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service handling the business logic for real-time bird battles.
 * Uses an in-memory storage for active sessions.
 */
@Service
public class BattleService {

    private final Map<String, BattleSession> activeBattles = new ConcurrentHashMap<>();
    private final EventPublisherService eventPublisherService;

    public BattleService(EventPublisherService eventPublisherService) {
        this.eventPublisherService = eventPublisherService;
    }

    /**
     * Creates a new battle session waiting for a second player.
     */
    public Mono<BattleSession> createMatch(UUID hostPlayerId, UUID birdCardId) {
        int defaultHealth = 100; // Stat-based health should come from DB in future
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
            return Mono.error(new IllegalArgumentException("Battle session not found with ID: " + sessionId));
        }
        if (!"WAITING".equals(session.getStatus())) {
            return Mono.error(new IllegalStateException("Session is not in WAITING state"));
        }

        session.setPlayerTwoId(guestPlayerId);
        session.setPlayerTwoBirdCardId(birdCardId);
        session.setPlayerTwoHealth(session.getPlayerOneHealth()); // Sync health
        session.setStatus("IN_PROGRESS");

        return Mono.just(session);
    }

    /**
     * Processes a battle action asynchronously.
     * Actions are held until BOTH players have submitted for the round.
     */
    public Mono<BattleSession> processAction(BattleAction action) {
        BattleSession session = activeBattles.get(action.getSessionId());

        if (session == null || !"IN_PROGRESS".equals(session.getStatus())) {
            return Mono.error(new IllegalStateException("Invalid or inactive session"));
        }

        boolean isPlayerOne = action.getPlayerId().equals(session.getPlayerOneId());

        // Store the action
        if (isPlayerOne) {
            session.setPlayerOnePendingAction(action.getSeedsSpent());
        } else {
            session.setPlayerTwoPendingAction(action.getSeedsSpent());
        }

        // Check if both players have submitted their actions for this round
        if (session.getPlayerOnePendingAction() != null && session.getPlayerTwoPendingAction() != null) {
            resolveRound(session);
        }

        return Mono.just(session);
    }

    /**
     * Resolves the round once both actions are present.
     */
    private void resolveRound(BattleSession session) {
        // Relational Damage Calculation (Simplified for now)
        int p1Damage = session.getPlayerOnePendingAction() * 15;
        int p2Damage = session.getPlayerTwoPendingAction() * 15;

        // Apply damage simultaneously
        session.setPlayerTwoHealth(Math.max(0, session.getPlayerTwoHealth() - p1Damage));
        session.setPlayerOneHealth(Math.max(0, session.getPlayerOneHealth() - p2Damage));

        // Advance round and clear actions
        session.setCurrentRound(session.getCurrentRound() + 1);
        session.setPlayerOnePendingAction(null);
        session.setPlayerTwoPendingAction(null);

        checkWinner(session);
    }

    private void checkWinner(BattleSession session) {
        if (session.getPlayerOneHealth() <= 0) {
            finishBattle(session, session.getPlayerTwoId());
        } else if (session.getPlayerTwoHealth() <= 0) {
            finishBattle(session, session.getPlayerOneId());
        }
    }

    private void finishBattle(BattleSession session, UUID winnerId) {
        session.setStatus("FINISHED");
        session.setWinnerId(winnerId);
        // Distribute rewards via RabbitMQ
        eventPublisherService.publishBattleReward(winnerId, 100);
    }
}

