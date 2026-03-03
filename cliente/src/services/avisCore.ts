import { registerPlugin } from '@capacitor/core';
import { Bird, InventoryItem } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Interface Definitions
// ─────────────────────────────────────────────────────────────────────────────

export interface AvisCorePlugin {
    /** Execute a battle attack. Delegates to Spring Boot via Tailscale. */
    executeBattleAttack(options: { move: string; birdId: string }): Promise<{ result: string; log: string; damage: number }>;

    /** Fetch inventory items from the native Room DB cache. */
    fetchInventory(options: { userId: string }): Promise<{ items: InventoryItem[] }>;

    /** Sync device GPS location (FusedLocationProviderClient). */
    syncLocation(): Promise<{ lat: number; lng: number; timestamp: number }>;

    /** Get player birds from the native Room DB cache. */
    getPlayerBirds(options: { userId: string }): Promise<{ birds: Bird[] }>;

    /** Store JWT securely in EncryptedSharedPreferences. */
    storeSecureToken(options: { token: string }): Promise<void>;

    /** Retrieve the stored JWT. */
    getSecureToken(): Promise<{ token: string | null }>;

    /** Save a local sighting (audio/photo) in SQLite. */
    saveSighting(options: {
        userId: string;
        birdId: string;
        lat: number;
        lon: number;
        audioPath?: string;
        photoPath?: string;
        notes?: string
    }): Promise<{ id: string }>;

    /** Persist birds fetched from server into Room DB. */
    saveBirds(options: { userId: string; birds: Bird[] }): Promise<void>;

    /** Persist inventory items fetched from server into Room DB. */
    saveInventory(options: { userId: string; items: InventoryItem[] }): Promise<void>;

    /** Ensure all required native permissions are granted (Android side flow). */
    ensurePermissions(): Promise<{ status: 'granted' | 'denied' }>;
}

/** Tailscale VPN connectivity plugin. */
export interface TailscalePluginInterface {
    initTailscale(options: {
        authKey: string;
        hostname: string;
        tailscaleUser?: string;
        tailscalePass?: string;
    }): Promise<{ status: string }>;
    stopTailscale(): Promise<void>;
    testTailscaleConnection(options: { url: string }): Promise<{ result: string }>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Web Mocks
// ─────────────────────────────────────────────────────────────────────────────

const avisCoreWebMock: AvisCorePlugin = {
    async executeBattleAttack(options) {
        return { result: 'Ataque ejecutado', log: `Ataque web mock`, damage: 10 };
    },
    async fetchInventory(options: { userId: string }) {
        return { items: [] };
    },
    async syncLocation() {
        return { lat: 40.2430, lng: -3.7005, timestamp: Date.now() };
    },
    async getPlayerBirds(options: { userId: string }) {
        return { birds: [] };
    },
    async storeSecureToken(options: { token: string }) {
        localStorage.setItem('secureToken', options.token);
    },
    async getSecureToken() {
        return { token: localStorage.getItem('secureToken') };
    },
    async saveSighting(options: { userId: string; birdId: string; lat: number; lon: number; audioPath?: string; photoPath?: string; notes?: string }) {
        console.log('[Web Mock] saveSighting', options);
        return { id: Math.random().toString() };
    },
    async saveBirds(options: { userId: string; birds: Bird[] }) {
        console.log('[Web Mock] saveBirds', options.birds.length, 'for user', options.userId);
    },
    async saveInventory(options: { userId: string; items: InventoryItem[] }) {
        console.log('[Web Mock] saveInventory', options.items.length, 'for user', options.userId);
    },
    async ensurePermissions() {
        return { status: 'granted' };
    }
};

const tailscaleWebMock: TailscalePluginInterface = {
    async initTailscale(options) {
        console.log('[Web Mock] initTailscale', options);
        return { status: 'Web mode' };
    },
    async stopTailscale() { },
    async testTailscaleConnection() { return { result: 'Web mode' }; },
};

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Registration
// ─────────────────────────────────────────────────────────────────────────────

const AvisCore = registerPlugin<AvisCorePlugin>('AvisCore', { web: avisCoreWebMock });

export const TailscalePlugin = registerPlugin<TailscalePluginInterface>(
    'TailscalePlugin',
    { web: tailscaleWebMock }
);

export default AvisCore;
