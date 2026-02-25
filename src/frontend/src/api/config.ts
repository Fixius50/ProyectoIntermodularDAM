/**
 * Backend API Configuration
 * 
 * Centralized config for REST endpoints and WebSocket/RSocket URIs.
 */

export const API_CONFIG = {
    // Vite will proxy calls starting with /api to the backend
    BASE_URL: '/api',
    RSOCKET_URL: 'ws://localhost:7000',
    EXTERNAL: {
        APP_URL: window.location.origin
    }
};

export const ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
    },
    SYSTEM: {
        TEST: '/pruebaConexion.txt'
    }
};
