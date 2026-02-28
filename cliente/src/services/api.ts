import AvisCore from './avisCore';

const isWebLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
// Si estamos en un dispositivo (Capacitor), el hostname suele ser 'localhost' pero NO es el servidor de desarrollo.
// Forzamos la IP de Tailscale si no estamos en un navegador de escritorio local.
const isApp = (window as any).Capacitor?.getPlatform() !== undefined;

const TAILSCALE_IP = '100.112.94.34';
const API_BASE_URL = (isWebLocal && !isApp)
    ? `http://${window.location.hostname}:8080/`
    : `http://${TAILSCALE_IP}:8080/`;

console.log(`[API] Entorno: ${isApp ? 'App' : 'Web'}. Usando Base URL: ${API_BASE_URL}`);

async function getAuthHeader(): Promise<Record<string, string>> {
    const { token } = await AvisCore.getSecureToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export const api = {
    async post(endpoint: string, data: any) {
        const authHeader = await getAuthHeader();
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        Object.entries(authHeader).forEach(([key, value]) => headers.append(key, value));

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    },

    async get(endpoint: string) {
        const authHeader = await getAuthHeader();
        const headers = new Headers();
        Object.entries(authHeader).forEach(([key, value]) => headers.append(key, value));

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    },

    async put(endpoint: string, data: any) {
        const authHeader = await getAuthHeader();
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        Object.entries(authHeader).forEach(([key, value]) => headers.append(key, value));

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    }
};
