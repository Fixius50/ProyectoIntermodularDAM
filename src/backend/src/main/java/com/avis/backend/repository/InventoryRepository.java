package com.avis.backend.repository;

import com.avis.backend.domain.UserInventory;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;
import java.util.UUID;

@Repository
public interface InventoryRepository extends R2dbcRepository<UserInventory, UUID> {

    Mono<UserInventory> findByUserId(UUID userId);

}

