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
public class AuthService {

    private final PlayerRepository playerRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    /** Registra un nuevo jugador y devuelve el JWT + perfil. */
    public Mono<Map<String, Object>> register(String username, String password) {
        return playerRepository.findByUsername(username)
                .flatMap(existing -> Mono.<Map<String, Object>>error(
                        new IllegalArgumentException("El nombre de usuario ya existe.")))
                .switchIfEmpty(Mono.defer(() -> {
                    Player newPlayer = Player.builder()
                            .id(UUID.randomUUID())
                            .username(username)
                            .passwordHash(passwordEncoder.encode(password))
                            .level(1)
                            .experience(0)
                            .feathers(10)
                            .createdAt(OffsetDateTime.now())
                            .build();
                    return playerRepository.save(newPlayer)
                            .map(saved -> buildTokenResponse(saved));
                }));
    }

    /** Autentica al jugador y devuelve el JWT + perfil. */
    public Mono<Map<String, Object>> login(String username, String password) {
        return playerRepository.findByUsername(username)
                .switchIfEmpty(Mono.error(new IllegalArgumentException("Usuario o contraseña incorrectos.")))
                .flatMap(player -> {
                    if (!passwordEncoder.matches(password, player.getPasswordHash())) {
                        return Mono.error(new IllegalArgumentException("Usuario o contraseña incorrectos."));
                    }
                    return Mono.just(buildTokenResponse(player));
                });
    }

    private Map<String, Object> buildTokenResponse(Player player) {
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
