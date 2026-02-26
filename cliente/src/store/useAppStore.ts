import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AvisCore from '../services/avisCore';
import {
    AppState,
    User,
    Notification,
    QuickLink,
    WeatherData,
    TimeData
} from '../types';

interface AppActions {
    setWeather: (weather: WeatherData) => void;
    setTime: (time: TimeData) => void;
    setUser: (user: User | null) => void;
    addNotification: (notif: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
    markNotificationAsRead: (id: string) => void;
    markAllNotificationsAsRead: () => void;
    setCurrentScreen: (screen: string) => void;
    login: (email: string, pass: string) => Promise<boolean>;
    register: (name: string, email: string, pass: string) => Promise<boolean>;
    logout: () => void;
    syncInventory: () => Promise<void>;
    syncPlayerBirds: () => Promise<void>;
    executeAttack: (move: string, birdId: string) => Promise<void>;
}

type CombinedState = AppState & AppActions & { currentScreen: string };

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

export const useAppStore = create<CombinedState>()(
    persist(
        (set) => ({
            // Initial State
            playerBirds: [],
            opponentBirds: [],
            inventory: [],
            activeBirdsCount: 0,
            rareSightings: 0,
            streak: 0,
            weather: null,
            time: { phase: 'Morning', hour: 8, icon: 'wb_twilight' },
            pinnedLinks: DEFAULT_PINNED_LINKS,
            currentUser: null,
            notifications: [],
            posts: [],
            guildChats: {},
            availableGuilds: [],
            currentScreen: 'login',
            battleLogs: [],

            // Actions
            setWeather: (weather: WeatherData) => set({ weather }),
            setTime: (time: TimeData) => set({ time }),
            setUser: (currentUser: User | null) => set({ currentUser }),
            addNotification: (notif: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => set((state) => ({
                notifications: [
                    {
                        ...notif,
                        id: Math.random().toString(36).substring(2, 9),
                        timestamp: Date.now(),
                        isRead: false
                    },
                    ...state.notifications
                ]
            })),
            markNotificationAsRead: (id: string) => set((state) => ({
                notifications: state.notifications.map(n => n.id === id ? { ...n, isRead: true } : n)
            })),
            markAllNotificationsAsRead: () => set((state) => ({
                notifications: state.notifications.map(n => ({ ...n, isRead: true }))
            })),
            setCurrentScreen: (currentScreen: string) => set({ currentScreen }),

            login: async (email: string, pass: string) => {
                console.log('Logging in...', email, pass);
                if (email && pass) {
                    set({
                        currentUser: {
                            id: 'u1',
                            name: email.split('@')[0],
                            rank: 'Ornitólogo Novel',
                            level: 1,
                            xp: 0,
                            maxXp: 100,
                            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
                            feathers: 10,
                            joinDate: new Date().toISOString()
                        },
                        currentScreen: 'home'
                    });
                    return true;
                }
                return false;
            },

            register: async (name: string, email: string, pass: string) => {
                console.log('Registering...', name, email, pass);
                if (name && email && pass) {
                    set({
                        currentUser: {
                            id: 'u1',
                            name: name,
                            rank: 'Novato',
                            level: 1,
                            xp: 0,
                            maxXp: 100,
                            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
                            feathers: 0,
                            joinDate: new Date().toISOString()
                        },
                        currentScreen: 'home'
                    });
                    return true;
                }
                return false;
            },

            logout: () => set({ currentUser: null, currentScreen: 'login' }),

            syncInventory: async () => {
                try {
                    const { items } = await AvisCore.fetchInventory();
                    set({ inventory: items });
                } catch (err) {
                    console.error('CorePlugin Error: fetchInventory', err);
                }
            },

            syncPlayerBirds: async () => {
                try {
                    const { birds } = await AvisCore.getPlayerBirds();
                    set({
                        playerBirds: birds,
                        activeBirdsCount: birds.filter(b => b.status === 'Santuario').length
                    });
                } catch (err) {
                    console.error('CorePlugin Error: getPlayerBirds', err);
                }
            },

            executeAttack: async (move: string, birdId: string) => {
                try {
                    const result = await AvisCore.executeBattleAttack({ move, birdId });
                    set((state) => ({
                        battleLogs: [result.log, ...state.battleLogs].slice(0, 10)
                    }));
                } catch (err) {
                    console.error('CorePlugin Error: executeBattleAttack', err);
                }
            },
        }),
        {
            name: 'aery-storage',
            partialize: (state) => ({
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
                availableGuilds: state.availableGuilds,
            }),
        }
    )
);
