package com.intermodular.server.service;

import com.intermodular.server.config.RabbitMQConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class MatchmakingService {

    private final RabbitTemplate rabbitTemplate;

    public void queuePlayer(String playerId) {
        log.info("Encolando jugador {} para matchmaking", playerId);
        // Emplearemos el ID del jugador para encolarlo
        rabbitTemplate.convertAndSend(RabbitMQConfig.MATCHMAKING_EXCHANGE, RabbitMQConfig.MATCHMAKING_ROUTING_KEY,
                playerId);
    }

    @RabbitListener(queues = RabbitMQConfig.MATCHMAKING_QUEUE)
    public void processMatchmaking(String playerId) {
        log.info("Procesando jugador extraido de la cola: {}", playerId);
        // Aqui iria la logica de esperar a otro jugador o asignarle una Room
        // Ejemplo simplificado: Se asume que entra en una partida simulada
        String roomId = UUID.randomUUID().toString();
        log.info("Jugador {} asignado a Room {}", playerId, roomId);

        // Normalmente aqui publicariamos otro evento o mandariamos
        // a traves de RSocket la confirmacion de match existoso.
    }
}
