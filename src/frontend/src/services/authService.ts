/**
 * AVIS — Servicio de Autenticación
 * Capa de servicio que conecta con el backend para login, registro y refresh.
 * Mientras no haya backend, simula las respuestas con datos mock.
 */
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../types/auth';
import { apiFetch, setTokens, clearTokens } from './apiClient';

// ─── FLAG DE MODO MOCK ─────────────────────────────────────
const USE_MOCK = true; // Cambiar a false cuando el backend esté listo

// ─── MOCK JWT (simula token) ───────────────────────────────
function mockJwt(userId: string): string {
    // Base64 simulado — no es un JWT real
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
        sub: userId,
        iat: Date.now(),
        exp: Date.now() + 15 * 60 * 1000,
    }));
    return `${header}.${payload}.mock-signature`;
}

// ─── USUARIOS MOCK ─────────────────────────────────────────
const mockUsers: (User & { password: string })[] = [
    {
        id: 'user-1',
        username: 'Naturalista',
        email: 'demo@avis.com',
        avatar: '🧑‍🔬',
        createdAt: '2025-01-15T10:00:00Z',
        password: 'demo123',
    },
];

// ─── LOGIN ─────────────────────────────────────────────────
export async function login(req: LoginRequest): Promise<AuthResponse> {
    if (USE_MOCK) {
        // Simular delay de red
        await new Promise((r) => setTimeout(r, 800));

        const user = mockUsers.find(
            (u) => u.email === req.email && u.password === req.password
        );

        if (!user) {
            throw new Error('Credenciales incorrectas. Prueba con demo@avis.com / demo123');
        }

        const tokens = {
            accessToken: mockJwt(user.id),
            refreshToken: `refresh-${user.id}-${Date.now()}`,
            expiresIn: 900,
        };

        setTokens(tokens.accessToken, tokens.refreshToken);

        return {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                createdAt: user.createdAt,
            },
            tokens,
        };
    }

    // Backend real
    const response = await apiFetch<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(req),
        skipAuth: true,
    });

    setTokens(response.tokens.accessToken, response.tokens.refreshToken);
    return response;
}

// ─── REGISTRO ──────────────────────────────────────────────
export async function register(req: RegisterRequest): Promise<AuthResponse> {
    if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 1000));

        // Comprobar si ya existe
        const existing = mockUsers.find((u) => u.email === req.email);
        if (existing) {
            throw new Error('Ya existe una cuenta con este email');
        }

        const newUser: User = {
            id: `user-${Date.now()}`,
            username: req.username,
            email: req.email,
            avatar: '🐦',
            createdAt: new Date().toISOString(),
        };

        mockUsers.push({ ...newUser, password: req.password });

        const tokens = {
            accessToken: mockJwt(newUser.id),
            refreshToken: `refresh-${newUser.id}-${Date.now()}`,
            expiresIn: 900,
        };

        setTokens(tokens.accessToken, tokens.refreshToken);

        return { user: newUser, tokens };
    }

    // Backend real
    const response = await apiFetch<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(req),
        skipAuth: true,
    });

    setTokens(response.tokens.accessToken, response.tokens.refreshToken);
    return response;
}

// ─── LOGOUT ────────────────────────────────────────────────
export async function logout(): Promise<void> {
    if (!USE_MOCK) {
        try {
            await apiFetch('/auth/logout', { method: 'POST' });
        } catch {
            // Ignorar errores al hacer logout
        }
    }
    clearTokens();
}

// ─── OBTENER PERFIL ────────────────────────────────────────
export async function getProfile(): Promise<User> {
    if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 300));
        return mockUsers[0];
    }

    return apiFetch<User>('/auth/me');
}
