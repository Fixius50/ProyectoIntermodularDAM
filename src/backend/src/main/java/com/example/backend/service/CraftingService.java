package com.example.backend.service;

import com.example.backend.domain.BirdCard;
import com.example.backend.domain.BirdRecord;
import com.example.backend.dto.CraftingRequest;
import com.example.backend.repository.BirdCardRepository;
import com.example.backend.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CraftingService {

    private final InventoryRepository inventoryRepository;
    private final BirdCardRepository birdCardRepository;
    private final BirdCatalogService birdCatalogService;

    // Dummy "motor de probabilidad"
    private final Random random = new Random();

    public Mono<BirdCard> craftBird(CraftingRequest request) {
        return inventoryRepository.findByUserId(request.getUserId())
                .switchIfEmpty(Mono.error(new RuntimeException("Usuario no tiene inventario.")))
                .flatMap(inv -> {
                    // 1. Validar que tiene suficientes materiales
                    if (inv.getMadera() < request.getMadera() ||
                            inv.getHierbas() < request.getHierbas() ||
                            inv.getMetal() < request.getMetal() ||
                            inv.getSemillas() < request.getSemillas()) {
                        return Mono.error(new RuntimeException("Materiales insuficientes"));
                    }

                    // 2. Descontar materiales
                    inv.setMadera(inv.getMadera() - request.getMadera());
                    inv.setHierbas(inv.getHierbas() - request.getHierbas());
                    inv.setMetal(inv.getMetal() - request.getMetal());
                    inv.setSemillas(inv.getSemillas() - request.getSemillas());

                    return inventoryRepository.save(inv);
                })
                .flatMap(savedInv -> applyWeatherAndCatalog(request.getUserId()));
    }

    private Mono<BirdCard> applyWeatherAndCatalog(UUID userId) {
        // En el futuro, aquí se consultaría la API del clima
        // Por ahora, leemos todo el catálogo y elegimos uno al azar.
        return birdCatalogService.getAllBirds()
                .collectList()
                .flatMap(catalog -> {
                    if (catalog.isEmpty()) {
                        return Mono.error(new RuntimeException("El catálogo remoto está vacío o es inaccesible."));
                    }

                    BirdRecord randomBird = catalog.get(random.nextInt(catalog.size()));

                    BirdCard newCard = BirdCard.builder()
                            .userId(userId)
                            .birdId(randomBird.getId())
                            .nombre(randomBird.getNombre())
                            .vida(randomBird.getVida())
                            .danoAtaque(randomBird.getDanoAtaque())
                            .defensa(randomBird.getDefensa())
                            .tipo(randomBird.getTipo())
                            .velocidad(randomBird.getVelocidad())
                            .imagenUrl(randomBird.getImagenUrl())
                            .fechaObtencion(LocalDateTime.now())
                            .build();

                    return birdCardRepository.save(newCard);
                });
    }

}
