package com.example.backend.controller;

import com.example.backend.domain.UserInventory;
import com.example.backend.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import java.util.UUID;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping("/{userId}")
    public Mono<UserInventory> getUserInventory(@PathVariable UUID userId) {
        return inventoryService.getInventoryByUserId(userId);
    }

    // Esto será llamado por el Backend cuando el jugador termine un minijuego
    // Georreferenciado
    @PostMapping("/{userId}/loot")
    public Mono<UserInventory> receiveExpeditionLoot(
            @PathVariable UUID userId,
            @RequestParam int madera,
            @RequestParam int hierbas) {

        return inventoryService.addExpeditionLoot(userId, madera, hierbas);
    }

}
