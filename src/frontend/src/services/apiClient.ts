/**
 * AVIS — Cliente HTTP base
 * Centraliza las peticiones al backend con JWT, refresh automático y retry.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// ─── ALMACENAMIENTO DE TOKENS ──────────────────────────────
let storedAccessToken: string | null = null;
let storedRefreshToken: string | null = null;

export function setTokens(access: string, refresh: string) {
    storedAccessToken = access;
    storedRefreshToken = refresh;
    // Persistir en localStorage para web
    try {
        localStorage.setItem('avis_access_token', access);
        localStorage.setItem('avis_refresh_token', refresh);
    } catch {
        // SSR o entorno sin localStorage
    }
}

export function loadTokens(): { access: string | null; refresh: string | null } {
    try {
        storedAccessToken = localStorage.getItem('avis_access_token');
        storedRefreshToken = localStorage.getItem('avis_refresh_token');
    } catch {
        // SSR o entorno sin localStorage
    }
    return { access: storedAccessToken, refresh: storedRefreshToken };
}

export function clearTokens() {
    storedAccessToken = null;
    storedRefreshToken = null;
    try {
        localStorage.removeItem('avis_access_token');
        localStorage.removeItem('avis_refresh_token');
    } catch {
        // SSR
    }
}

export function getAccessToken(): string | null {
    return storedAccessToken;
}

// ─── REFRESH AUTOMÁTICO ────────────────────────────────────
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
    if (!storedRefreshToken) return null;

    // Evitar múltiples refresh en paralelo
    if (isRefreshing && refreshPromise) return refreshPromise;

    isRefreshing = true;
    refreshPromise = (async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken: storedRefreshToken }),
            });

            if (!res.ok) {
                clearTokens();
                return null;
            }

            const data = await res.json();
            setTokens(data.accessToken, data.refreshToken || storedRefreshToken!);
            return data.accessToken as string;
        } catch {
            clearTokens();
            return null;
        } finally {
            isRefreshing = false;
            refreshPromise = null;
        }
    })();

    return refreshPromise;
}

// ─── FETCH CON AUTH ────────────────────────────────────────
export interface ApiOptions extends Omit<RequestInit, 'headers'> {
    headers?: Record<string, string>;
    skipAuth?: boolean;
}

export async function apiFetch<T = any>(
    path: string,
    options: ApiOptions = {}
): Promise<T> {
    const { headers = {}, skipAuth = false, ...rest } = options;

    // Añadir Authorization header
    const reqHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...headers,
    };

    if (!skipAuth && storedAccessToken) {
        reqHeaders['Authorization'] = `Bearer ${storedAccessToken}`;
    }

    let res = await fetch(`${API_BASE_URL}${path}`, {
        ...rest,
        headers: reqHeaders,
    });

    // Si 401, intentar refresh y reintentar
    if (res.status === 401 && !skipAuth && storedRefreshToken) {
        const newToken = await refreshAccessToken();
        if (newToken) {
            reqHeaders['Authorization'] = `Bearer ${newToken}`;
            res = await fetch(`${API_BASE_URL}${path}`, {
                ...rest,
                headers: reqHeaders,
            });
        }
    }

    if (!res.ok) {
        const errorBody = await res.text();
        throw new ApiError(res.status, errorBody || res.statusText);
    }

    // Si 204 No Content, devolver undefined
    if (res.status === 204) return undefined as T;

    return res.json();
}

// ─── ERROR PERSONALIZADO ───────────────────────────────────
export class ApiError extends Error {
    status: number;
    body: string;

    constructor(status: number, body: string) {
        super(`API Error ${status}: ${body}`);
        this.status = status;
        this.body = body;
    }
}
