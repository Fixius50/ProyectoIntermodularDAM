package com.example.backend.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BirdRecord {

    private Long id;

    private String nombre;
    private int vida;
    private int danoAtaque;
    private int defensa;
    private String tipo;
    private int suerte;
    private int velocidad;
    private String imagenUrl;

}
