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
async function getBaseUrl(forceLocal: boolean = false): Promise<string> {
    if (cachedBaseUrl) return cachedBaseUrl;

    const isApp = (window as any).Capacitor?.getPlatform() !== 'web';
    console.log(`[API] Detectando entorno... (isApp: ${isApp}, forceLocal: ${forceLocal})`);

    // 1. Detección en Android (App oficial de Tailscale)
    if (isApp) {
        try {
            const { value: isTailscaleInstalled } = await AppLauncher.canOpenUrl({ url: 'com.tailscale.ipn' });
            if (isTailscaleInstalled) {
                console.log('[API] App de Tailscale detectada en Android. Usando IP directa.');
                cachedBaseUrl = `http://${TAILSCALE_IP}:${PORT}`;
                return cachedBaseUrl;
            }
        } catch (e) {
            console.warn('[API] Error detectando App de Tailscale.');
        }
    }

    const localHost = isApp ? '10.0.2.2' : 'localhost';
    const localUrl = `http://${localHost}:${PORT}`;
    const remoteUrl = `http://${TAILSCALE_IP}:${PORT}`;

    // 2. Conectividad Inteligente
    if (forceLocal) {
        console.log(`[API] Verificando conectividad paralela (Modo Test)...`);
        const checkUrl = async (url: string, timeout: number): Promise<string> => {
            const controller = new AbortController();
            const t = setTimeout(() => controller.abort(), timeout);
            try {
                await fetch(`${url}${HEALTH_ENDPOINT}`, { signal: controller.signal, mode: 'no-cors' });
                clearTimeout(t);
                return url;
            } catch (e) {
                clearTimeout(t);
                throw e;
            }
        };

        try {
            const results = await Promise.allSettled([
                checkUrl(localUrl, 500),
                checkUrl(remoteUrl, 1000)
            ]);
            const firstSuccess = results.find(r => r.status === 'fulfilled') as PromiseFulfilledResult<string> | undefined;
            if (firstSuccess) {
                cachedBaseUrl = firstSuccess.value;
                return cachedBaseUrl;
            }
        } catch (e) {
            console.log('[API] Fallo en detección paralela.');
        }
    } else {
        console.log(`[API] Intentando conexión remota (Tailscale)...`);
        try {
            const controller = new AbortController();
            const t = setTimeout(() => controller.abort(), 1500);
            await fetch(`${remoteUrl}${HEALTH_ENDPOINT}`, { signal: controller.signal, mode: 'no-cors' });
            clearTimeout(t);
            cachedBaseUrl = remoteUrl;
            return cachedBaseUrl;
        } catch (e) {
            console.log('[API] Conexión remota no disponible.');
        }
    }

    // 3. Fallback final
    cachedBaseUrl = localUrl;
    return localUrl;
}

async function getAuthHeader(): Promise<Record<string, string>> {
    const { token } = await AvisCore.getSecureToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export const api = {
    async post(endpoint: string, data: any, forceLocal: boolean = false) {
        const baseUrl = await getBaseUrl(forceLocal);
        const authHeader = await getAuthHeader();
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        Object.entries(authHeader).forEach(([key, value]) => headers.append(key, value));

        let cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        if (!cleanEndpoint.startsWith('/api')) {
            cleanEndpoint = `/api${cleanEndpoint}`;
        }

        const fullUrl = `${baseUrl}${cleanEndpoint}`;
        console.log(`[API] Realizando POST a: ${fullUrl}`);

        const response = await fetch(fullUrl, {
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

    async get(endpoint: string, forceLocal: boolean = false) {
        const baseUrl = await getBaseUrl(forceLocal);
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

    async put(endpoint: string, data: any, forceLocal: boolean = false) {
        const baseUrl = await getBaseUrl(forceLocal);
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
