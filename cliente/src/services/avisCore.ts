import { registerPlugin } from '@capacitor/core';
import { Bird, InventoryItem } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Interface Definitions
// ─────────────────────────────────────────────────────────────────────────────

/** Core game-data plugin (maps to AvisCorePlugin.java). */
export interface AvisCorePlugin {
    /** Execute a battle attack. Delegates to Spring Boot via Tailscale. */
    executeBattleAttack(options: { move: string; birdId: string }): Promise<{ result: string; log: string; damage: number }>;

    /** Fetch inventory items from the native Room DB cache. */
    fetchInventory(): Promise<{ items: InventoryItem[] }>;

    /** Sync device GPS location (FusedLocationProviderClient). */
    syncLocation(): Promise<{ lat: number; lng: number; timestamp: number }>;

    /** Get player birds from the native Room DB cache. */
    getPlayerBirds(): Promise<{ birds: Bird[] }>;

    /** Store JWT securely in EncryptedSharedPreferences. */
    storeSecureToken(options: { token: string }): Promise<void>;

    /** Retrieve the stored JWT. */
    getSecureToken(): Promise<{ token: string | null }>;
}

/** Tailscale VPN connectivity plugin (maps to TailscalePlugin.java). */
export interface TailscalePluginInterface {
    /**
     * Initialise the Tailscale node and join the Tailnet.
     * Must be called on app startup before any backend API calls.
     */
    initTailscale(options: { authKey: string; hostname: string }): Promise<{ status: string }>;

    /** Shut down the Tailscale node cleanly. */
    stopTailscale(): Promise<void>;

    /**
     * Send a test HTTP GET through the active Tailscale connection.
     * Used to verify the VPN is live before game data operations.
     */
    testTailscaleConnection(options: { url: string }): Promise<{ result: string }>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Web Mocks  (used when running in the browser with `npm run dev`)
// ─────────────────────────────────────────────────────────────────────────────

const avisCoreWebMock: AvisCorePlugin = {
    async executeBattleAttack(options) {
        console.log('[Web Mock] executeBattleAttack', options);
        return {
            result: 'Ataque ejecutado',
            log: `El ave ${options.birdId} usó ${options.move} con éxito.`,
            damage: Math.floor(Math.random() * 20) + 10,
        };
    },
    async fetchInventory() {
        console.log('[Web Mock] fetchInventory');
        return {
            items: [
                { id: 'i1', name: 'Baya Vital', icon: 'eco', count: 5, description: 'Recupera 20 HP' },
                { id: 'i2', name: 'Agua Clara', icon: 'water_drop', count: 3, description: 'Recupera 10 Estamina' },
            ],
        };
    },
    async syncLocation() {
        console.log('[Web Mock] syncLocation → Pinto, Madrid');
        return { lat: 40.2430, lng: -3.7005, timestamp: Date.now() };
    },
    async getPlayerBirds() {
        console.log('[Web Mock] getPlayerBirds');
        return {
            birds: [
                {
                    id: 'b1', name: 'Cigüeña Blanca', scientificName: 'Ciconia ciconia', level: 24, status: 'Santuario', type: 'Flight',
                    hp: 85, maxHp: 100, xp: 450, maxXp: 1000, stamina: 50, maxStamina: 100,
                    canto: 75, plumaje: 80, vuelo: 90,
                    image: 'https://images.pexels.com/photos/4516315/pexels-photo-4516315.jpeg?auto=compress&cs=tinysrgb&w=400',
                },
                {
                    id: 'b2', name: 'Petirrojo', scientificName: 'Erithacus rubecula', level: 22, status: 'Certamen', type: 'Songbird',
                    hp: 60, maxHp: 80, xp: 200, maxXp: 800, stamina: 40, maxStamina: 60,
                    canto: 95, plumaje: 60, vuelo: 50,
                    image: 'https://images.pexels.com/photos/14234384/pexels-photo-14234384.jpeg?auto=compress&cs=tinysrgb&w=400',
                },
            ],
        };
    },
    async storeSecureToken(options) {
        console.log('[Web Mock] storeSecureToken');
        localStorage.setItem('secureToken', options.token);
    },
    async getSecureToken() {
        console.log('[Web Mock] getSecureToken');
        return { token: localStorage.getItem('secureToken') };
    },
};

const tailscaleWebMock: TailscalePluginInterface = {
    async initTailscale(options) {
        console.log('[Web Mock] initTailscale — skipped in browser mode', options);
        return { status: 'Web mode: Tailscale not needed' };
    },
    async stopTailscale() {
        console.log('[Web Mock] stopTailscale — no-op in browser mode');
    },
    async testTailscaleConnection(options) {
        console.warn('[Web Mock] testTailscaleConnection — browser cannot reach Tailscale IP.');
        return { result: 'Web mode: not reachable — use Android device' };
    },
};

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Registration
// ─────────────────────────────────────────────────────────────────────────────

/**
 * AvisCore — main game data bridge.
 * On Android: delegates to AvisCorePlugin.java.
 * On Web (dev): uses the mock above.
 */
const AvisCore = registerPlugin<AvisCorePlugin>('AvisCore', { web: avisCoreWebMock });

/**
 * TailscalePlugin — VPN connectivity bridge.
 * On Android: delegates to TailscalePlugin.java (Go/tsnet .aar).
 * On Web (dev): no-op mock (Tailscale not needed in browser).
 */
export const TailscalePlugin = registerPlugin<TailscalePluginInterface>(
    'TailscalePlugin',
    { web: tailscaleWebMock }
);

export default AvisCore;
