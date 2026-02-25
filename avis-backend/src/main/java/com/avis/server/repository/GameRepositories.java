package com.avis.server.repository;

import com.avis.server.model.BirdCard;
import com.avis.server.model.Player;
import com.avis.server.model.PlayerInventory;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import java.util.UUID;

public interface GameRepositories {

    // Repositorio para buscar, guardar y borrar Pájaros
    interface BirdCardRepository extends R2dbcRepository<BirdCard, UUID> {}

    // Repositorio para gestionar a los Jugadores
    interface PlayerRepository extends R2dbcRepository<Player, UUID> {}

    // Repositorio para consultar el inventario y las coordenadas
    interface PlayerInventoryRepository extends R2dbcRepository<PlayerInventory, UUID> {}

}
