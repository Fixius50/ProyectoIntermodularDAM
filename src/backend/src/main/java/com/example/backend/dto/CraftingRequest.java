package com.example.backend.dto;

import lombok.Data;

@Data
public class CraftingRequest {
    private Long userId;
    private int madera;
    private int hierbas;
    private int metal;
    private int semillas;
}
