import { WeatherData } from './services/weather';
import { getBirdById, createPlayerBird } from './data/birds';
import { TimeData, getCurrentTimeData } from './services/time';

export interface Bird {
    id: string;
    name: string;
    level: number;
    xp: number;
    maxXp: number;
    type: 'Flight' | 'Song' | 'Plumage' | 'Raptor' | 'Songbird' | 'Water';
    hp: number;
    maxHp: number;
    stamina: number;
    maxStamina: number;
    // Core Attributes for Certamen
    canto: number;
    plumaje: number;
    vuelo: number;
    image: string;
    audioUrl?: string;
    origin?: string;
    isStudied?: boolean;
}

export interface InventoryItem {
    id: string;
    name: string;
    count: number;
    icon: string;
    description: string;
}

export interface QuickLink {
    id: string;
    screen: string;
    label: string;
    icon: string;
    image: string;
    description: string;
}

export interface Notification {
    id: string;
    type: 'achievement' | 'sighting' | 'weather' | 'system';
    title: string;
    message: string;
    timestamp: number;
    isRead: boolean;
}

export interface User {
    id: string;
    name: string;
    rank: string;
    level: number;
    xp: number;
    maxXp: number;
    avatar: string;
    feathers: number;
    joinDate: string;
    email?: string;
    guildId?: string;
}

export interface Guild {
    id: string;
    name: string;
    level: number;
    members: number;
    mission: string;
    missionProgress: number;
    missionTarget: number;
    missionTimeLeft: string;
}

export interface ChatMessage {
    id: string;
    userId: string;
    userName: string;
    avatar: string;
    text: string;
    timestamp: number;
}

export interface SocialPost {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    time: string;
    location: string;
    text: string;
    imageUrl?: string;
    likes: number;
    comments: number;
}

export interface AppState {
    playerBirds: Bird[];
    opponentBirds: Bird[];
    inventory: InventoryItem[];
    activeBirdsCount: number;
    rareSightings: number;
    streak: number;
    weather: WeatherData | null;
    time: TimeData;
    pinnedLinks: QuickLink[];
    currentUser: User | null;
    notifications: Notification[];
    posts: SocialPost[];
    guildChats: Record<string, ChatMessage[]>;
    availableGuilds: Guild[];
}

// ─── Opponent birds (no need to persist, they're static NPC data) ────────────
export const NPC_OPPONENT_BIRDS: Bird[] = [
    {
        id: 'o1',
        name: 'European Robin',
        level: 5,
        xp: 0,
        maxXp: 500,
        type: 'Songbird',
        hp: 92,
        maxHp: 95,
        stamina: 80,
        maxStamina: 100,
        canto: 75,
        plumaje: 40,
        vuelo: 60,
        image: 'https://images.pexels.com/photos/59523/pexels-photo-59523.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
];

// ─── Default pinned links ─────────────────────────────────────────────────────
const DEFAULT_PINNED_LINKS: QuickLink[] = [
    {
        id: 'l1',
        screen: 'expedition',
        label: 'Expedición',
        icon: 'explore',
        image: 'https://images.pexels.com/photos/15286/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400',
        description: 'Sal al campo a descubrir nuevas especies.'
    },
    {
        id: 'l2',
        screen: 'album',
        label: 'El Álbum',
        icon: 'menu_book',
        image: 'https://images.pexels.com/photos/415071/pexels-photo-415071.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Consulta tus avistamientos y lore.'
    },
    {
        id: 'l3',
        screen: 'store',
        label: 'Tienda',
        icon: 'shopping_cart',
        image: 'https://images.pexels.com/photos/264547/pexels-photo-264547.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Adquiere suministros y nuevas aves.'
    }
];

// ─── Fresh state for a brand new user ────────────────────────────────────────
export function createEmptyState(): AppState {
    const defaultGuilds: Guild[] = [
        {
            id: 'g1',
            name: 'Los Albatros',
            level: 15,
            members: 24,
            mission: 'Avistar 50 Rapaces de Pinto',
            missionProgress: 32,
            missionTarget: 50,
            missionTimeLeft: 'Termina en 2d'
        },
        {
            id: 'g2',
            name: 'Pinto Wildlife',
            level: 8,
            members: 45,
            mission: 'Capturar 10 aves épicas',
            missionProgress: 2,
            missionTarget: 10,
            missionTimeLeft: 'Termina en 1d'
        }
    ];

    const defaultPosts: SocialPost[] = [
        {
            id: 'p1',
            userId: 'u1',
            userName: 'Pablo_Nat',
            userAvatar: 'https://i.pravatar.cc/150?u=post_1',
            time: 'Hace 2 horas',
            location: 'Parque Juan Carlos I',
            text: '¡Increíble encuentro hoy! Logré fotografiar a un Cernícalo Primilla en pleno vuelo. Sus colores eran espectaculares bajo la luz del atardecer.',
            imageUrl: 'https://images.pexels.com/photos/14840742/pexels-photo-14840742.jpeg?auto=compress&cs=tinysrgb&w=800',
            likes: 20,
            comments: 5
        },
        {
            id: 'p2',
            userId: 'u2',
            userName: 'Laura_Aves',
            userAvatar: 'https://i.pravatar.cc/150?u=post_2',
            time: 'Hace 5 horas',
            location: 'Centro Urbano',
            text: 'Acabo de divisar varios vencejos rozando los tejados. Parecen estar anidando temprano este año. ¿Alguien más ha notado actividad inusual?',
            imageUrl: 'https://images.pexels.com/photos/1054394/pexels-photo-1054394.jpeg?auto=compress&cs=tinysrgb&w=800',
            likes: 34,
            comments: 6
        }
    ];

    const defaultGuildChats: Record<string, ChatMessage[]> = {
        'g1': [
            { id: 'c1', userId: 'ext1', userName: 'Explorador_1', avatar: 'https://i.pravatar.cc/150?u=user1', text: '¡Hola a todos! Buena caza hoy.', timestamp: Date.now() - 3600000 },
            { id: 'c2', userId: 'ext2', userName: 'Explorador_2', avatar: 'https://i.pravatar.cc/150?u=user2', text: 'Llevamos buen ritmo con la misión de la semana.', timestamp: Date.now() - 1800000 }
        ]
    };

    return {
        playerBirds: [],
        opponentBirds: NPC_OPPONENT_BIRDS,
        inventory: [],
        activeBirdsCount: 0,
        rareSightings: 0,
        streak: 0,
        weather: null,
        time: getCurrentTimeData(),
        pinnedLinks: DEFAULT_PINNED_LINKS,
        currentUser: null,
        notifications: [
            {
                id: 'welcome',
                type: 'system',
                title: '¡Bienvenido a Aery!',
                message: 'Tu cuaderno de campo está listo. Ve a Expedición para descubrir tu primera ave.',
                timestamp: Date.now(),
                isRead: false
            }
        ],
        posts: defaultPosts,
        guildChats: defaultGuildChats,
        availableGuilds: defaultGuilds
    };
}

// ─── LocalStorage helpers ─────────────────────────────────────────────────────
const STORAGE_KEY_PREFIX = 'aery_progress_';
const LAST_USER_KEY = 'aery_last_user';

function storageKey(email: string): string {
    return STORAGE_KEY_PREFIX + email.toLowerCase().trim();
}

function saveProgress(email: string, state: AppState): void {
    try {
        // Don't persist weather/time (dynamic, re-fetched on load)
        const toSave = {
            playerBirds: state.playerBirds,
            inventory: state.inventory,
            activeBirdsCount: state.activeBirdsCount,
            rareSightings: state.rareSightings,
            streak: state.streak,
            pinnedLinks: state.pinnedLinks,
            currentUser: state.currentUser,
            notifications: state.notifications,
            posts: state.posts,
            guildChats: state.guildChats,
            availableGuilds: state.availableGuilds
        };
        localStorage.setItem(storageKey(email), JSON.stringify(toSave));
        localStorage.setItem(LAST_USER_KEY, email);
    } catch (e) {
        console.warn('[Aery] Could not save progress to localStorage:', e);
    }
}

function loadProgress(email: string): Partial<AppState> | null {
    try {
        const raw = localStorage.getItem(storageKey(email));
        if (!raw) return null;
        return JSON.parse(raw) as Partial<AppState>;
    } catch (e) {
        console.warn('[Aery] Could not load progress from localStorage:', e);
        return null;
    }
}

// ─── State Store ──────────────────────────────────────────────────────────────
class StateStore {
    /** Check if a bird can be acquired based on inventory */
    canAcquireBird(birdId: string): boolean {
        const catalog = getBirdById(birdId);
        if (!catalog) return false;
        // Ensure all required upgrade items are present in inventory with count > 0
        return catalog.upgradeItems.every(itemId =>
            this.state.inventory.some(inv => inv.id === itemId && inv.count > 0)
        );
    }

    /** Acquire a bird if requirements are met, deduct items, add to player birds */
    acquireBird(birdId: string): boolean {
        const catalog = getBirdById(birdId);
        if (!catalog) return false;
        if (!this.canAcquireBird(birdId)) return false;
        // Deduct required items
        catalog.upgradeItems.forEach(itemId => {
            const invIndex = this.state.inventory.findIndex(inv => inv.id === itemId);
            if (invIndex >= 0) {
                const inv = this.state.inventory[invIndex];
                if (inv.count > 1) {
                    inv.count -= 1;
                } else {
                    this.state.inventory.splice(invIndex, 1);
                }
            }
        });
        // Add the new bird to player collection
        const newBird = createPlayerBird(birdId);
        if (newBird) {
            this.state.playerBirds.push(newBird);
            this.state.activeBirdsCount = this.state.playerBirds.length;
            this.saveCurrentProgress();
            this.notify();
            return true;
        }
        return false;
    }
    private state: AppState = createEmptyState();
    private listeners: (() => void)[] = [];

    constructor() {
        // Try to restore the last logged-in user on app boot
        const lastEmail = localStorage.getItem(LAST_USER_KEY);
        if (lastEmail) {
            const saved = loadProgress(lastEmail);
            if (saved) {
                this.state = { ...createEmptyState(), ...saved, time: getCurrentTimeData(), weather: null };
            }
        }
    }

    getState(): AppState {
        return this.state;
    }

    setState(newState: Partial<AppState>): void {
        this.state = { ...this.state, ...newState };
        this.saveCurrentProgress();
        this.notify();
    }

    private saveCurrentProgress(): void {
        const email = this.state.currentUser?.email;
        if (email) {
            saveProgress(email, this.state);
        }
    }

    addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>): void {
        const newNotif: Notification = {
            ...notification,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: Date.now(),
            isRead: false
        };
        this.state.notifications = [newNotif, ...this.state.notifications];
        this.saveCurrentProgress();
        this.notify();
        window.dispatchEvent(new CustomEvent('app-notification', { detail: newNotif }));
    }

    /**
     * Log in an existing user — restores their saved progress.
     * Returns true if the user had saved progress, false if they are new.
     */
    login(user: User): boolean {
        const email = user.email ?? user.name;
        const saved = loadProgress(email);

        if (saved && saved.currentUser) {
            // Existing user: restore their state
            this.state = {
                ...createEmptyState(),
                ...saved,
                currentUser: { ...saved.currentUser, ...user },
                time: getCurrentTimeData(),
                weather: null
            };
            localStorage.setItem(LAST_USER_KEY, email);
            this.notify();
            this.addNotification({
                type: 'system',
                title: 'Sesión Restaurada',
                message: `¡Bienvenido de nuevo, ${user.name}! Tienes ${this.state.playerBirds.length} aves en tu santuario.`
            });
            return true;
        } else {
            // Brand new user
            this.resetForNewUser(user);
            return false;
        }
    }

    /** Start completely fresh for a new user */
    resetForNewUser(user: User): void {
        const email = user.email ?? user.name;
        this.state = {
            ...createEmptyState(),
            currentUser: user,
        };
        localStorage.setItem(LAST_USER_KEY, email);
        saveProgress(email, this.state);
        this.notify();
        this.addNotification({
            type: 'system',
            title: '¡Cuaderno Abierto!',
            message: `Bienvenido, ${user.name}. Ve a Expedición para descubrir tu primera ave.`
        });
    }

    logout(): void {
        localStorage.removeItem(LAST_USER_KEY);
        this.state = createEmptyState();
        this.notify();
        (window as any).router.navigate('login');
    }

    subscribe(listener: () => void): () => void {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notify(): void {
        this.listeners.forEach(l => l());
    }
}

export const store = new StateStore();
(window as any).store = store;
