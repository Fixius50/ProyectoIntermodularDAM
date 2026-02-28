import AvisCore from './avisCore';

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const TAILSCALE_IP = '100.112.239.82';
const API_BASE_URL = isLocal ? `http://${window.location.hostname}:8080/api` : `http://${TAILSCALE_IP}:8080/api`;

console.log(`[API] Usando Base URL: ${API_BASE_URL}`);

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
