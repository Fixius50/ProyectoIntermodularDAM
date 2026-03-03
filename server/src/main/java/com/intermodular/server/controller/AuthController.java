package com.intermodular.server.controller;

import com.intermodular.server.model.Player;
import com.intermodular.server.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final PlayerRepository playerRepository;

    @PostMapping("/register")
    public Mono<ResponseEntity<?>> register(@RequestBody Player player) {
        if (player.getId() == null) {
            player.setId(UUID.randomUUID());
        }
        player.setNew(true); 

        return playerRepository.save(player)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .onErrorResume(e -> {
                    // Si el usuario ya existe, devolvemos un error 400 limpio para que la app lo entienda
                    return Mono.just(ResponseEntity.badRequest().body("El usuario ya existe o hay un error en los datos."));
                });
    }

    @PostMapping("/login")
    public Mono<ResponseEntity<Player>> login(@RequestBody Player credentials) {
        // Buscamos al usuario en la base de datos por su nombre
        return playerRepository.findByUsername(credentials.getUsername())
                // Comparamos que la contraseña coincida
                .filter(player -> player.getPassword().equals(credentials.getPassword()))
                // Si todo va bien, le damos un 200 OK y sus datos
                .map(ResponseEntity::ok)
                // Si falla o no existe, le damos un 401 Unauthorized
                .defaultIfEmpty(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }
}
