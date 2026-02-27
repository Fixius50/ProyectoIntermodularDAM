package com.intermodular.server.repository;

import com.intermodular.server.model.Bandada;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface BandadaRepository extends R2dbcRepository<Bandada, UUID> {
}
