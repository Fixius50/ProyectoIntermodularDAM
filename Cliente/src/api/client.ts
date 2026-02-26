/**
 * Base API Client
 * 
 * Wraps the standard Fetch API to automatically inject the Authorization header 
 * holding the JWT token, and handle common errors globally.
 */

import { API_CONFIG } from './config';

interface DefaultJsonMap {
    [key: string]: unknown;
}

class ApiClient {
    private getToken(): string | null {
        return localStorage.getItem('jwt_token');
    }

    public async get<T = DefaultJsonMap>(path: string, options: RequestInit = {}): Promise<T> {
        return this.request<T>(path, { ...options, method: 'GET' });
    }

    public async post<T = DefaultJsonMap>(path: string, body: unknown, options: RequestInit = {}): Promise<T> {
        return this.request<T>(path, {
            ...options,
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    private async request<T>(path: string, options: RequestInit): Promise<T> {
        const headers = new Headers(options.headers || {});
        headers.set('Content-Type', 'application/json');

        const token = this.getToken();
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        const config: RequestInit = {
            ...options,
            headers,
        };

        const url = `${API_CONFIG.BASE_URL}${path}`;

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                // Here we could handle 401/403 globally
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Return plain text if not JSON
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json() as T;
            } else {
                return await response.text() as unknown as T;
            }

        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }
}

export const apiClient = new ApiClient();
