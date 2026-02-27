package com.intermodular.server.service;

import com.intermodular.server.model.Bandada;
import com.intermodular.server.repository.BandadaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BandadaService {

    private final BandadaRepository bandadaRepository;
    private final DatabaseClient db;

    public Flux<Bandada> findAll() {
        return bandadaRepository.findAll()
                .flatMap(bandada -> db.sql(
                        "SELECT COUNT(*) cnt FROM bandada_members WHERE bandada_id = :id")
                        .bind("id", bandada.getId())
                        .map((row, meta) -> row.get("cnt", Long.class))
                        .one()
                        .map(count -> {
                            bandada.setMemberCount(count.intValue());
                            return bandada;
                        }));
    }

    public Mono<Bandada> create(String nombre, String descripcion, UUID liderId) {
        Bandada b = Bandada.builder()
                .id(UUID.randomUUID())
                .nombre(nombre)
                .descripcion(descripcion)
                .liderId(liderId)
                .level(1)
                .mission("Realizar 20 avistamientos en Pinto")
                .missionProgress(0)
                .missionTarget(20)
                .build();
        return bandadaRepository.save(b)
                .flatMap(saved -> joinMember(saved.getId(), liderId).thenReturn(saved));
    }

    public Mono<Void> joinMember(UUID bandadaId, UUID playerId) {
        return db.sql("INSERT INTO bandada_members (bandada_id, player_id, joined_at) " +
                "VALUES (:bid, :pid, :ts) ON CONFLICT DO NOTHING")
                .bind("bid", bandadaId)
                .bind("pid", playerId)
                .bind("ts", OffsetDateTime.now())
                .then();
    }
}
