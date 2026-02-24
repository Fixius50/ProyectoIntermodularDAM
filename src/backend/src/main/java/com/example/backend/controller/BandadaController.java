package com.example.backend.controller;

import com.example.backend.domain.Bandada;
import com.example.backend.repository.BandadaRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import java.util.UUID;

@RestController
@RequestMapping("/api/bandadas")
@RequiredArgsConstructor
@Tag(name = "Bandadas", description = "Endpoints para la gestión de grupos (Bandadas)")
public class BandadaController {

    private final BandadaRepository bandadaRepository;

    @GetMapping
    @Operation(summary = "Listar todas las bandadas")
    public Flux<Bandada> getAll() {
        return bandadaRepository.findAll();
    }

    @PostMapping
    @Operation(summary = "Crear una nueva bandada")
    public Mono<Bandada> create(@RequestBody Bandada bandada) {
        return bandadaRepository.save(bandada);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener detalles de una bandada")
    public Mono<Bandada> getById(@PathVariable UUID id) {
        return bandadaRepository.findById(id);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar una bandada")
    public Mono<Void> delete(@PathVariable UUID id) {
        return bandadaRepository.deleteById(id);
    }
}
