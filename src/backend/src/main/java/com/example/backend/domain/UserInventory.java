package com.example.backend.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("user_inventory")
public class UserInventory {

    @Id
    private Long id;

    private Long userId; // Vinculado a Supabase Auth User ID (convertido a numerico o UUID despues)

    // Recursos del módulo "Expedición"
    private int madera;
    private int hierbas;
    private int metal;
    private int semillas; // Moneda para batalla / cebo
    private int notasDeCampo; // "Polvo estelar" para mejorar drops

}
