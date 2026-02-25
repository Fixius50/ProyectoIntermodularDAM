import { apiClient } from './client';
import { ENDPOINTS } from './config';

export interface AuthResponse {
    token: string;
}

export const authApi = {
    /**
     * Authenticates a user and stores the JWT on success.
     */
    login: async (username: string, password: string): Promise<boolean> => {
        try {
            const response = await apiClient.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, {
                username,
                password
            });

            if (response && response.token) {
                localStorage.setItem('jwt_token', response.token);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Login Error:", error);
            return false;
        }
    },

    /**
     * Clears local authentication state.
     */
    logout: () => {
        localStorage.removeItem('jwt_token');
        // Optionally trigger a re-render or redirect to login
        window.location.hash = 'home';
    },

    /**
     * Checks if a valid token exists (basic check, doesn't verify expiration)
     */
    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('jwt_token');
    },

    /**
     * Tests the connection to the backend
     */
    testConnection: async (): Promise<string> => {
        try {
            // Note: Our TestConnectionController returns raw string, not JSON
            const response = await apiClient.get<string>(ENDPOINTS.SYSTEM.TEST);
            return response;
        } catch (error) {
            console.error("Test connection failed:", error);
            return "Connection Failed";
        }
    }
};
