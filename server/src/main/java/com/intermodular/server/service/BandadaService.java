package com.intermodular.server.service;

import com.intermodular.server.model.Bandada;
import com.intermodular.server.repository.BandadaMemberRepository;
import com.intermodular.server.repository.BandadaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class BandadaService {

    private final BandadaRepository bandadaRepository;
    private final BandadaMemberRepository memberRepository;

    public Flux<Bandada> getAllGuilds() {
        log.info("[BandadaService] Obteniendo la lista de todas las bandadas (grupos)");
        return bandadaRepository.findAll()
                .doOnError(e -> log.error("[BandadaService] Error al obtener bandadas de la BD: {}", e.getMessage()));
    }

    public Mono<Bandada> getGuildById(UUID id) {
        log.info("[BandadaService] Buscando bandada con ID: {}", id);
        return bandadaRepository.findById(id)
                .doOnError(e -> log.error("[BandadaService] Error al obtener bandada {}: {}", id, e.getMessage()));
    }

    public Mono<Bandada> createGuild(Bandada bandada) {
        log.info("[BandadaService] Solicitud para crear nueva bandada: {}", bandada.getNombre());
        return bandadaRepository.save(bandada)
                .flatMap(saved -> {
                    log.info("[BandadaService] Bandada creada con ID: {}. Añadiendo líder como miembro.",
                            saved.getId());
                    return memberRepository.addMember(saved.getId(), saved.getLiderId())
                            .thenReturn(saved);
                })
                .doOnError(e -> log.error("[BandadaService] Error inesperado creando la bandada: {}", e.getMessage()));
    }

    public Mono<Void> joinGuild(UUID bandadaId, UUID playerId) {
        log.info("[BandadaService] Solicitud de jugador {} para unirse a bandada {}", playerId, bandadaId);
        return memberRepository.addMember(bandadaId, playerId)
                .doOnSuccess(v -> log.info("[BandadaService] Jugador {} unido exitosamente a la bandada {}", playerId,
                        bandadaId))
                .doOnError(e -> log.error("[BandadaService] Error al intentar unir jugador {} a bandada {}: {}",
                        playerId, bandadaId, e.getMessage()))
                .then();
    }
}
