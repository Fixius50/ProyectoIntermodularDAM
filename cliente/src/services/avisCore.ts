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

const AvisCore = registerPlugin<AvisCorePlugin>('AvisCore', {
    web: {
        async executeBattleAttack(options: { move: string, birdId: string }) {
            console.log('[Web Mock] executeBattleAttack', options);
            return {
                result: 'Ataque ejecutado',
                log: `El ave ${options.birdId} usó ${options.move} con éxito.`,
                damage: Math.floor(Math.random() * 20) + 10
            };
        },
        async fetchInventory() {
            console.log('[Web Mock] fetchInventory');
            return {
                items: [
                    { id: 'i1', name: 'Baya Vital', icon: 'eco', count: 5, description: 'Recupera 20 HP' },
                    { id: 'i2', name: 'Agua Clara', icon: 'water_drop', count: 3, description: 'Recupera 10 Estamina' }
                ]
            };
        },
        async syncLocation() {
            console.log('[Web Mock] syncLocation');
            return { lat: 40.4168, lng: -3.7038, timestamp: Date.now() };
        },
        async getPlayerBirds() {
            console.log('[Web Mock] getPlayerBirds');
            return {
                birds: [
                    {
                        id: 'b1', name: 'Cigüeña Blanca', level: 24, status: 'Santuario', type: 'Flight',
                        hp: 85, maxHp: 100, xp: 450, maxXp: 1000, stamina: 50, maxStamina: 100,
                        canto: 75, plumaje: 80, vuelo: 90, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDy_vffNMzrcLthsvCk4UJaqX1bKWqbOs4l7SlN6OL3Q2hA6Du1EiiKuVVlVRImposdMAWDLXBM3V39Ex_sKkETiv3rD-MWQ0h4v7JjBQR5LTfwJRg8njb9SSG4SR282r_SeENr6tLocb3QACF9YEA8q1zL1XQSxWbbrAPdZE50ATBP9hsMNxXzCSCfSmk-UyaThx5BlXbr6blGP2UztBP2vpmrhVIecTOgjJ2oAF7lG19SLfsUhS4anM7iT0JmYk45sit-l7RTYQag'
                    },
                    {
                        id: 'b2', name: 'Petirrojo', level: 22, status: 'Certamen', type: 'Songbird',
                        hp: 60, maxHp: 80, xp: 200, maxXp: 800, stamina: 40, maxStamina: 60,
                        canto: 95, plumaje: 60, vuelo: 50, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5dpGQRjXb4qgme_OdDkZx7rguxe0AQ14VsEDR5j_RGAmZgTxdVoZqchX0zyp2dZsmnAY49vwVh8LdjsF2hvm6rGYCF6wLn_pt74dj0DNWKYrr1rX36BThr2Un0DZ5RVIp84ymZ2yZIl_IQhRvoyPEIo29ebk0pDW4NMVBae3ofZwZ5ugga2qDyZX2eDRvgGkOYdr7Xr6HNADoJCAysVM88oMwQ-wy0j_gRDfXFlSh2UwwPblRKOMQKnGs_PN9-BvtSYOks0EkCYCB'
                    }
                ]
            };
        },
        async storeSecureToken(options: { token: string }) {
            console.log('[Web Mock] storeSecureToken', options);
            localStorage.setItem('secureToken', options.token);
        },
        async getSecureToken() {
            console.log('[Web Mock] getSecureToken');
            return { token: localStorage.getItem('secureToken') };
        }
    }
});

export default AvisCore;
