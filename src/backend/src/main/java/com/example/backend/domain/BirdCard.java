package com.example.backend.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("bird_cards")
public class BirdCard {

    @Id
    private UUID id;

    private UUID userId; // Dueño de la carta
    private Long birdId; // Referencia al ID del JSON original

    // Stats basícas copiadas al momento de creación
    private String nombre;
    private int vida;
    private int danoAtaque;
    private int defensa;
    private String tipo;
    private int velocidad;
    private String imagenUrl;
    private String descripcion;

    private LocalDateTime fechaObtencion;

}
