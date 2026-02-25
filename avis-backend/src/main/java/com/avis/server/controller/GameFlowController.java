package com.avis.server.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import reactor.core.publisher.Mono;

@Controller
public class GameFlowController {

    // Este endpoint RSocket escuchará a los clientes Android
    @MessageMapping("game.connect")
    public Mono<String> handleClientConnection(String playerId) {
        System.out.println("⚡ Nuevo jugador conectado al flujo: " + playerId);
        return Mono.just("¡Bienvenido a AVIS, " + playerId + "! Servidor listo y a la escucha.");
    }
}
