package com.example.backend.controller;

import com.example.backend.domain.BattleSession;
import com.example.backend.dto.BattleAction;
import com.example.backend.service.BattleService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * RSocket controller that listens to battle events.
 * It provides a bidirectional channel (streaming/request-response) between the
 * client and server.
 */
@Controller
@RequiredArgsConstructor
@Slf4j
public class BattleRSocketController {

    private final BattleService battleService;

    /**
     * Endpoint for creating a match room.
     * Expects a JSON object with host information.
     */
    @MessageMapping("battle.room.create")
    public Mono<BattleSession> createMatch(BattleAction hostRequest) {
        log.info("Player {} is creating a room for bird {}", hostRequest.getPlayerId(), hostRequest.getSessionId()); // sessionId
                                                                                                                     // here
                                                                                                                     // acts
                                                                                                                     // temporarily
                                                                                                                     // as
                                                                                                                     // bird_id
        // Parse hack for demonstration: sessionId payload space used for birdId in
        // creation
        UUID birdCardId = UUID.fromString(hostRequest.getSessionId());
        return battleService.createMatch(hostRequest.getPlayerId(), birdCardId);
    }

    /**
     * Endpoint for joining a room.
     */
    @MessageMapping("battle.room.join")
    public Mono<BattleSession> joinMatch(BattleAction joinRequest) {
        log.info("Player {} joining room {}", joinRequest.getPlayerId(), joinRequest.getSessionId());
        // Payload hack for demo string ID passing
        UUID birdCardId = new java.util.UUID(0L, (long) joinRequest.getSeedsSpent());
        return battleService.joinMatch(joinRequest.getSessionId(), joinRequest.getPlayerId(), birdCardId);
    }

    /**
     * Receives streams of Battle actions (attacks) and responds with the updated
     * session state.
     * This establishes the Fire-and-Forget or Request-Stream duplex communication.
     */
    @MessageMapping("battle.action.stream")
    public Flux<BattleSession> streamAction(Flux<BattleAction> actionStream) {
        return actionStream.flatMap(action -> {
            log.info("Player {} attacked in session {}, spent {} seeds", action.getPlayerId(), action.getSessionId(),
                    action.getSeedsSpent());
            return battleService.processAction(action);
        });
    }

}
