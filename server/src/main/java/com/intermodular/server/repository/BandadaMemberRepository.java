package com.intermodular.server.repository;

import com.intermodular.server.model.BandadaMember;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Repository
public interface BandadaMemberRepository extends ReactiveCrudRepository<BandadaMember, UUID> {

    @Query("INSERT INTO bandada_members (bandada_id, player_id) VALUES (:bandadaId, :playerId) RETURNING *")
    Mono<BandadaMember> addMember(UUID bandadaId, UUID playerId);

    @Query("DELETE FROM bandada_members WHERE bandada_id = :bandadaId AND player_id = :playerId")
    Mono<Void> removeMember(UUID bandadaId, UUID playerId);
}
