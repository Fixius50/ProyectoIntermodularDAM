package com.avis.backend.service;

import com.avis.backend.domain.BirdCard;
import com.avis.backend.domain.BirdRecord;
import com.avis.backend.dto.CraftingRequest;
import com.avis.backend.repository.BirdCardRepository;
import com.avis.backend.repository.InventoryRepository;
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
    private final WeatherService weatherService;

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
        // Consultamos el clima real (lat/lon hardcoded por ahora, vendrían del usuario en el futuro)
        return weatherService.getCurrentWeather(40.4168, -3.7038) // Madrid default
                .flatMap(weather -> {
                    System.out.println("Clima detectado para expedición: " + weather);
                    return birdCatalogService.getAllBirds()
                            .collectList();
                })
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

