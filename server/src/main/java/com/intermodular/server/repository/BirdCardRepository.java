package com.intermodular.server.repository;

import com.intermodular.server.model.BirdCard;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface BirdCardRepository extends R2dbcRepository<BirdCard, UUID> {
    // Aqui se definiran futuros metodos async de busqueda
    // e.g: Flux<BirdCard> findByElement(String element);
}
