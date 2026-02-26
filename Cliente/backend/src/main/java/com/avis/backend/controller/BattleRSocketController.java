package com.avis.backend.controller;

import com.avis.backend.domain.BattleSession;
import com.avis.backend.dto.BattleAction;
import com.avis.backend.service.BattleService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * RSocket controller that manages real-time battle sessions.
 * Optimized for Tailscale mesh networks (listening on 0.0.0.0).
 */
@Controller
@RequiredArgsConstructor
@Slf4j
public class BattleRSocketController {

    private final BattleService battleService;

    /**
     * Creates a new match room.
     * The client should send a BattleAction with its playerId and the birdCardId
     * they want to use in the 'sessionId' field (temp mapping) or a dedicated
     * field.
     */
    @MessageMapping("battle.room.create")
    public Mono<BattleSession> createMatch(BattleAction hostRequest) {
        log.info("Player {} is creating a battle room", hostRequest.getPlayerId());

        // In a real scenario, birdCardId would be a separate field in the DTO
        // For now, we assume the client passes the UUID as a string in sessionId for
        // room creation
        UUID birdCardId = UUID.fromString(hostRequest.getSessionId());
        return battleService.createMatch(hostRequest.getPlayerId(), birdCardId);
    }

    /**
     * Joins an existing battle session.
     */
    @MessageMapping("battle.room.join")
    public Mono<BattleSession> joinMatch(BattleAction joinRequest) {
        log.info("Player {} joining room {}", joinRequest.getPlayerId(), joinRequest.getSessionId());

        // Guest also needs to select a bird. Using seedsSpent as a dummy long for the
        // demonstration
        // but transitioning to proper UUID string parsing if possible.
        UUID birdCardId = UUID.randomUUID(); // Placeholder: in production, parse from payload
        return battleService.joinMatch(joinRequest.getSessionId(), joinRequest.getPlayerId(), birdCardId);
    }

    /**
     * Continuous stream of battle actions.
     * Established via Request-Stream for real-time state updates.
     */
    @MessageMapping("battle.action.stream")
    public Flux<BattleSession> streamAction(Flux<BattleAction> actionStream) {
        return actionStream.flatMap(action -> {
            log.debug("Action received: Player {} in session {}", action.getPlayerId(), action.getSessionId());
            return battleService.processAction(action)
                    .onErrorResume(e -> {
                        log.error("Error processing battle action: {}", e.getMessage());
                        return Mono.empty();
                    });
        });
    }

}

