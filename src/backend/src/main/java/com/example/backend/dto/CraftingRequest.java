package com.example.backend.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class CraftingRequest {
    private UUID userId;
    private int madera;
    private int hierbas;
    private int metal;
    private int semillas;
}
