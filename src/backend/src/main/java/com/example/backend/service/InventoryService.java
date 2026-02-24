package com.example.backend.service;

import com.example.backend.domain.UserInventory;
import com.example.backend.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    /**
     * Obtiene el inventario actual asincronamente
     */
    public Mono<UserInventory> getInventoryByUserId(Long userId) {
        return inventoryRepository.findByUserId(userId)
                .switchIfEmpty(Mono.defer(() -> createDefaultInventory(userId)));
    }

    /**
     * Si no tiene inventario, crea un base
     */
    private Mono<UserInventory> createDefaultInventory(Long userId) {
        UserInventory newInventory = UserInventory.builder()
                .userId(userId)
                .madera(10) // Starter pack
                .semillas(20)
                .hierbas(5)
                .metal(0)
                .notasDeCampo(0)
                .build();
        return inventoryRepository.save(newInventory);
    }

    /**
     * Simulacion de llegada de expedicion con loot
     */
    public Mono<UserInventory> addExpeditionLoot(Long userId, int bonusMadera, int bonusHierba) {
        return getInventoryByUserId(userId)
                .flatMap(inv -> {
                    inv.setMadera(inv.getMadera() + bonusMadera);
                    inv.setHierbas(inv.getHierbas() + bonusHierba);
                    // Si hizo el minijuego de la foto, podría venir con "notasDeCampo" extra.
                    return inventoryRepository.save(inv);
                });
    }

}
