/**
 * AVIS — Tipos de Autenticación
 */

// ─── USUARIO ───────────────────────────────────────────────
export interface User {
    id: string;
    username: string;
    email: string;
    avatar?: string;
    createdAt: string;
}

// ─── TOKENS ────────────────────────────────────────────────
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;      // Segundos hasta expiración del access token
}

// ─── PETICIONES ────────────────────────────────────────────
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

// ─── RESPUESTAS ────────────────────────────────────────────
export interface AuthResponse {
    user: User;
    tokens: AuthTokens;
}

// ─── ESTADO DE AUTH ────────────────────────────────────────
export type AuthStatus = 'IDLE' | 'LOADING' | 'AUTHENTICATED' | 'UNAUTHENTICATED' | 'ERROR';

export interface AuthState {
    user: User | null;
    tokens: AuthTokens | null;
    status: AuthStatus;
    error: string | null;
}
