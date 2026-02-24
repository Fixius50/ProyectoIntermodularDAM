/**
 * AVIS — AuthContext
 * Gestiona el estado de autenticación globalmente.
 * Proporciona login, register, logout y auto-restore de sesión.
 */
import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { AuthState, AuthStatus, User, AuthTokens } from '../types/auth';
import * as authService from '../services/authService';
import { loadTokens, clearTokens } from '../services/apiClient';

// ─── ACCIONES ──────────────────────────────────────────────
type AuthAction =
    | { type: 'AUTH_LOADING' }
    | { type: 'AUTH_SUCCESS'; payload: { user: User; tokens: AuthTokens } }
    | { type: 'AUTH_ERROR'; payload: string }
    | { type: 'AUTH_LOGOUT' }
    | { type: 'AUTH_RESTORE'; payload: User }
    | { type: 'CLEAR_ERROR' };

// ─── ESTADO INICIAL ────────────────────────────────────────
const initialState: AuthState = {
    user: null,
    tokens: null,
    status: 'IDLE',
    error: null,
};

// ─── REDUCER ───────────────────────────────────────────────
function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case 'AUTH_LOADING':
            return { ...state, status: 'LOADING', error: null };

        case 'AUTH_SUCCESS':
            return {
                user: action.payload.user,
                tokens: action.payload.tokens,
                status: 'AUTHENTICATED',
                error: null,
            };

        case 'AUTH_ERROR':
            return {
                ...state,
                status: 'ERROR',
                error: action.payload,
            };

        case 'AUTH_LOGOUT':
            return {
                user: null,
                tokens: null,
                status: 'UNAUTHENTICATED',
                error: null,
            };

        case 'AUTH_RESTORE':
            return {
                ...state,
                user: action.payload,
                status: 'AUTHENTICATED',
            };

        case 'CLEAR_ERROR':
            return { ...state, error: null };

        default:
            return state;
    }
}

// ─── CONTEXT ───────────────────────────────────────────────
interface AuthContextType {
    state: AuthState;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── PROVIDER ──────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Restaurar sesión al montar
    useEffect(() => {
        const restore = async () => {
            const { access } = loadTokens();
            if (access) {
                try {
                    dispatch({ type: 'AUTH_LOADING' });
                    const user = await authService.getProfile();
                    dispatch({ type: 'AUTH_RESTORE', payload: user });
                } catch {
                    clearTokens();
                    dispatch({ type: 'AUTH_LOGOUT' });
                }
            } else {
                dispatch({ type: 'AUTH_LOGOUT' });
            }
        };
        restore();
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        dispatch({ type: 'AUTH_LOADING' });
        try {
            const response = await authService.login({ email, password });
            dispatch({
                type: 'AUTH_SUCCESS',
                payload: { user: response.user, tokens: response.tokens },
            });
        } catch (err: any) {
            dispatch({
                type: 'AUTH_ERROR',
                payload: err.message || 'Error al iniciar sesión',
            });
            throw err;
        }
    }, []);

    const register = useCallback(async (username: string, email: string, password: string) => {
        dispatch({ type: 'AUTH_LOADING' });
        try {
            const response = await authService.register({ username, email, password });
            dispatch({
                type: 'AUTH_SUCCESS',
                payload: { user: response.user, tokens: response.tokens },
            });
        } catch (err: any) {
            dispatch({
                type: 'AUTH_ERROR',
                payload: err.message || 'Error al crear la cuenta',
            });
            throw err;
        }
    }, []);

    const logoutFn = useCallback(async () => {
        await authService.logout();
        dispatch({ type: 'AUTH_LOGOUT' });
    }, []);

    const clearError = useCallback(() => {
        dispatch({ type: 'CLEAR_ERROR' });
    }, []);

    const value: AuthContextType = {
        state,
        login,
        register,
        logout: logoutFn,
        clearError,
        isAuthenticated: state.status === 'AUTHENTICATED',
        isLoading: state.status === 'LOADING',
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// ─── HOOK ──────────────────────────────────────────────────
export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de <AuthProvider>');
    }
    return context;
}
