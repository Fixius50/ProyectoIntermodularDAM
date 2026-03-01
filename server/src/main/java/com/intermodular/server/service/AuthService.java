package com.intermodular.server.service;

import com.intermodular.server.model.Player;
import com.intermodular.server.repository.PlayerRepository;
import com.intermodular.server.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final PlayerRepository playerRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    /** Registra un nuevo jugador y devuelve el JWT + perfil. */
    public Mono<Map<String, Object>> register(String username, String password) {
        log.debug("[AuthService] Intento de registro para: {}", username);
        return playerRepository.findByUsername(username)
                .flatMap(existing -> {
                    log.warn("[AuthService] Error: El usuario {} ya existe.", username);
                    return Mono.<Map<String, Object>>error(
                            new IllegalArgumentException("El nombre de usuario ya existe."));
                })
                .switchIfEmpty(Mono.defer(() -> {
                    log.info("[AuthService] Usuario {} no existe. Procediendo a crear perfil...", username);
                    Player newPlayer = Player.builder()
                            .username(username)
                            .passwordHash(passwordEncoder.encode(password))
                            .level(1)
                            .experience(0)
                            .feathers(10)
                            .createdAt(OffsetDateTime.now())
                            .build();
                    return playerRepository.save(newPlayer)
                            .doOnSuccess(p -> log.info("[AuthService] Jugador guardado con éxito. ID: {}", p.getId()))
                            .map(saved -> buildTokenResponse(saved));
                }));
    }

    /** Autentica al jugador y devuelve el JWT + perfil. */
    public Mono<Map<String, Object>> login(String username, String password) {
        log.debug("[AuthService] Intento de login para: {}", username);
        return playerRepository.findByUsername(username)
                .switchIfEmpty(Mono.defer(() -> {
                    log.warn("[AuthService] Login fallido: Usuario {} no encontrado.", username);
                    return Mono.error(new IllegalArgumentException("Usuario o contraseña incorrectos."));
                }))
                .flatMap(player -> {
                    if (!passwordEncoder.matches(password, player.getPasswordHash())) {
                        log.warn("[AuthService] Login fallido: Contraseña incorrecta para {}.", username);
                        return Mono.error(new IllegalArgumentException("Usuario o contraseña incorrectos."));
                    }
                    log.info("[AuthService] Login exitoso para {}.", username);
                    return Mono.just(buildTokenResponse(player));
                });
    }

    private Map<String, Object> buildTokenResponse(Player player) {
        log.debug("[AuthService] Generando token y respuesta para: {}", player.getUsername());
        String token = jwtUtil.generateToken(player.getUsername());
        return Map.of(
                "token", token,
                "player", Map.of(
                        "id", player.getId().toString(),
                        "username", player.getUsername(),
                        "level", player.getLevel(),
                        "xp", player.getExperience(),
                        "feathers", player.getFeathers()));
    }
}
