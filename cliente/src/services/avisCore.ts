import { registerPlugin } from '@capacitor/core';
import { Bird, InventoryItem } from '../types';

export interface AvisCorePlugin {
    /**
     * Ejecuta un ataque en el Certamen.
     * Delega a la lógica nativa para calcular daño y estados.
     */
    executeBattleAttack(options: { move: string, birdId: string }): Promise<{ result: string, log: string, damage: number }>;

    /**
     * Obtiene el inventario desde Room (SQLite Nativo).
     */
    fetchInventory(): Promise<{ items: InventoryItem[] }>;

    /**
     * Sincroniza la ubicación actual usando FusedLocationProviderClient.
     */
    syncLocation(): Promise<{ lat: number, lng: number, timestamp: number }>;

    /**
     * Obtiene la lista de aves del usuario desde Room.
     */
    getPlayerBirds(): Promise<{ birds: Bird[] }>;

    /**
     * Guarda un token JWT de forma segura en EncryptedSharedPreferences.
     */
    storeSecureToken(options: { token: string }): Promise<void>;

    /**
     * Recupera el token guardado.
     */
    getSecureToken(): Promise<{ token: string | null }>;
}

const AvisCore = registerPlugin<AvisCorePlugin>('AvisCore');

export default AvisCore;
