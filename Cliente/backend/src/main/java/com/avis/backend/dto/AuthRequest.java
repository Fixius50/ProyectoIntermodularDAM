package com.avis.backend.dto;

import lombok.Data;

/**
 * DTO for receiving login credentials.
 */
@Data
public class AuthRequest {
    private String username;
    private String password;
}

