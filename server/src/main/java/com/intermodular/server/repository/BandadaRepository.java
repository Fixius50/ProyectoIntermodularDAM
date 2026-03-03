package com.intermodular.server.repository;

import com.intermodular.server.model.Bandada;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface BandadaRepository extends ReactiveCrudRepository<Bandada, UUID> {
}
