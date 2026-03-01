import { AppLauncher } from '@capacitor/app-launcher';
import AvisCore from './avisCore';

const TAILSCALE_IP = '100.112.94.34';
const PORT = '8080';
const HEALTH_ENDPOINT = '/api/public/health';

let cachedBaseUrl: string | null = null;

/**
 * Determina la URL base de la API detectando si Tailscale está disponible.
 * Prioriza Tailscale (100.x.x.x) si detecta la app en Android o si la IP responde en PC.
 */
async function getBaseUrl(): Promise<string> {
    if (cachedBaseUrl) return cachedBaseUrl;

    const isApp = (window as any).Capacitor?.getPlatform() !== 'web';
    const isWebLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    console.log(`[API] Detectando entorno... (isApp: ${isApp}, isWebLocal: ${isWebLocal})`);

    // 1. Detección en Android (App oficial de Tailscale)
    if (isApp) {
        try {
            const { value: isTailscaleInstalled } = await AppLauncher.canOpenUrl({ url: 'com.tailscale.ipn' });
            if (isTailscaleInstalled) {
                console.log('[API] App de Tailscale detectada en Android. Usando IP directa de Lubuntu.');
                cachedBaseUrl = `http://${TAILSCALE_IP}:${PORT}`;
                return cachedBaseUrl;
            }
        } catch (e) {
            console.warn('[API] Error detectando App de Tailscale en Android.');
        }
    }

    // 2. Health-check a la IP de Tailscale (PC o Android con puente activo)
    console.log(`[API] Verificando conectividad con Tailscale IP: ${TAILSCALE_IP}...`);
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500); // Aumentado a 2.5s para mayor tolerancia
        const response = await fetch(`http://${TAILSCALE_IP}:${PORT}${HEALTH_ENDPOINT}`, {
            signal: controller.signal,
            mode: 'no-cors'
        });
        clearTimeout(timeoutId);
        console.log('[API] Comunicación con Lubuntu (Tailscale) confirmada.');
        cachedBaseUrl = `http://${TAILSCALE_IP}:${PORT}`;
        return cachedBaseUrl;
    } catch (e) {
        console.log('[API] Tailscale IP no responde. Es posible que el servidor en Lubuntu no esté corriendo o el firewall bloquee el puerto 8080.');
    }

    // 3. Fallback a Localhost / Host de Emulador
    if (isWebLocal || isApp) {
        const fallbackHost = isApp ? '10.0.2.2' : window.location.hostname;
        console.log(`[API] Usando Fallback de desarrollo (${fallbackHost}).`);
        cachedBaseUrl = `http://${fallbackHost}:${PORT}`;
        return cachedBaseUrl;
    }

    // 4. Default por defecto si nada de lo anterior funciona
    const defaultHost = isApp ? '10.0.2.2' : TAILSCALE_IP;
    console.log(`[API] Usando Default Host: ${defaultHost}`);
    cachedBaseUrl = `http://${defaultHost}:${PORT}`;
    return cachedBaseUrl;
}

async function getAuthHeader(): Promise<Record<string, string>> {
    const { token } = await AvisCore.getSecureToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export const api = {
    async post(endpoint: string, data: any) {
        const baseUrl = await getBaseUrl();
        const authHeader = await getAuthHeader();
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        Object.entries(authHeader).forEach(([key, value]) => headers.append(key, value));

        let cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        if (!cleanEndpoint.startsWith('/api')) {
            cleanEndpoint = `/api${cleanEndpoint}`;
        }

        const response = await fetch(`${baseUrl}${cleanEndpoint}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        }).catch(err => {
            console.error(`[API] Fetch POST Error en ${endpoint}:`, err);
            throw err;
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    },

    async get(endpoint: string) {
        const baseUrl = await getBaseUrl();
        const authHeader = await getAuthHeader();
        const headers = new Headers();
        Object.entries(authHeader).forEach(([key, value]) => headers.append(key, value));

        let cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        if (!cleanEndpoint.startsWith('/api')) {
            cleanEndpoint = `/api${cleanEndpoint}`;
        }

        const response = await fetch(`${baseUrl}${cleanEndpoint}`, {
            headers
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    },

    async put(endpoint: string, data: any) {
        const baseUrl = await getBaseUrl();
        const authHeader = await getAuthHeader();
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        Object.entries(authHeader).forEach(([key, value]) => headers.append(key, value));

        let cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        if (!cleanEndpoint.startsWith('/api')) {
            cleanEndpoint = `/api${cleanEndpoint}`;
        }

        const response = await fetch(`${baseUrl}${cleanEndpoint}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    }
};
