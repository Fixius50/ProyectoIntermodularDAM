package com.avis.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * DTO returned to the client containing the generated JWT token on successful
 * login.
 */
@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
}

