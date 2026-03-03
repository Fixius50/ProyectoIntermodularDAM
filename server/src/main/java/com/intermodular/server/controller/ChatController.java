package com.intermodular.server.controller;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.ZonedDateTime;
import java.util.UUID;

@Controller
@Slf4j
public class ChatController {

    @MessageMapping("chat.global")
    public Flux<ChatMessage> streamGlobalChat(Flux<ChatMessage> incomingMessages) {
        log.info("[ChatController] Cliente conectado al chat global");
        return incomingMessages
                .doOnNext(msg -> log.info("[ChatController] (Global) Mensaje recibido de {}: {}", msg.getUserName(),
                        msg.getText()))
                .map(msg -> {
                    msg.setTimestamp(ZonedDateTime.now());
                    return msg;
                })
                .doOnError(e -> log.error("[ChatController] Error en stream global: {}", e.getMessage()));
    }

    @MessageMapping("chat.guild.{guildId}")
    public Flux<ChatMessage> streamGuildChat(@DestinationVariable("guildId") UUID guildId,
            Flux<ChatMessage> incomingMessages) {
        log.info("[ChatController] Cliente conectado al chat de la bandada: {}", guildId);
        return incomingMessages
                .doOnNext(msg -> log.info("[ChatController] (Bandada {}) Mensaje recibido de {}: {}", guildId,
                        msg.getUserName(), msg.getText()))
                .map(msg -> {
                    msg.setTimestamp(ZonedDateTime.now());
                    return msg;
                })
                .doOnError(
                        e -> log.error("[ChatController] Error en stream de bandada {}: {}", guildId, e.getMessage()));
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChatMessage {
        private String id;
        private String userId;
        private String userName;
        private String avatar;
        private String text;
        private ZonedDateTime timestamp;
    }
}
