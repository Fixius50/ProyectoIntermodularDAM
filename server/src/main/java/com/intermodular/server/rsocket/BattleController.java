package com.intermodular.server.rsocket;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import reactor.core.publisher.Flux;

import java.time.Duration;

@Controller
@Slf4j
public class BattleController {

    /**
     * Endpoint RSocket para recibir comandos de ataque y devolver
     * de forma reactiva y en tiempo real el nuevo estado de la batalla.
     */
    @MessageMapping("battle.attack")
    public Flux<BattleState> handleAttack(AttackCommand command) {
        log.info("Comando de ataque recibido: {}", command);

        // Simulacion:
        // En una implementacion real el servidor calcula los resultados de la
        // logica del juego, los daños, el RNG, guarda en bd/redis y emite
        // el nuevo estado a los subscritos a esa batalla/room especifica.

        return Flux.interval(Duration.ofMillis(500))
                .take(3)
                .map(i -> new BattleState(command.getRoomId(), 100 - (i.intValue() * 10), "El pajaro ha atacado."));
    }

    // Auxiliares simulados (DTOs)

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AttackCommand {
        private String roomId;
        private String playerId;
        private String targetBirdId;
        private String skillId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BattleState {
        private String roomId;
        private int enemyHealth;
        private String logMessage;
    }
}
