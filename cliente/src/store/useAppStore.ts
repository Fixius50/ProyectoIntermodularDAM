import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AvisCore, { TailscalePlugin } from '../services/avisCore';
import { AppLauncher } from '@capacitor/app-launcher';
import { api } from '../services/api';
import { fetchWeather } from '../services/weather';
import { getCurrentTimeData } from '../services/time';
import { fetchBirdImage, fetchBirdAudio } from '../services/birdMediaApi';
import { translations } from '../i18n/translations';
import {
    AppState,
    User,
    Notification,
    QuickLink,
    SocialPost,
    Bird,
    CatalogBird,
    WeatherData,
    TimeData,
    InventoryItem,
    TimePhase
} from '../types';

interface AppActions {
    isTailscaleReady: boolean;
    initApp: () => Promise<void>;
    setWeather: (weather: WeatherData) => void;
    setTime: (time: TimeData) => void;
    setUser: (user: User | null) => void;
    setAvatar: (avatarUrl: string) => void;
    setFavoriteBird: (birdId: string) => void;
    addActivity: (action: string, icon: string) => void;
    addNotification: (notif: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
    markNotificationAsRead: (id: string) => void;
    markAllNotificationsAsRead: () => void;
    setCurrentScreen: (screen: string) => void;
    login: (email: string, pass: string) => Promise<boolean>;
    testLogin: () => void;
    register: (name: string, email: string, pass: string) => Promise<boolean>;
    logout: () => void;
    syncInventory: () => Promise<void>;
    syncPlayerBirds: () => Promise<void>;
    hydrateBirdMedia: () => Promise<void>;
    executeAttack: (move: string, birdId: string) => Promise<void>;

    // Social Actions
    addPost: (post: Omit<SocialPost, 'id' | 'time' | 'likes' | 'comments' | 'reactions' | 'userId' | 'userName' | 'userAvatar'>) => void;
    reactToPost: (postId: string, reaction: string) => void;
    addComment: (postId: string, text: string) => void;

    // Guild Actions
    joinGuild: (guildId: string) => void;
    sendGuildMessage: (guildId: string, text: string) => void;
    contributeToMission: (amount: number) => void;

    // Battle Actions
    startBattle: () => void;
    endBattle: () => void;
    completeBattle: (rewardPlumas: number, rewardXP: number, birdId: string) => void;
    addBattleLog: (log: string) => void;
    clearBattleLogs: () => void;

    // Item Actions
    consumeItem: (itemId: string) => void;

    // Bird Actions
    updateStamina: (birdId: string, amount: number) => void;
    addBirdToSantuario: (birdId: string, media?: { audioPath?: string; photoPath?: string; notes?: string }) => Promise<void>;
    levelUpBird: (birdId: string) => void;
    removeBirdFromSantuario: (birdId: string) => void;

    // Environment Actions
    updateTime: () => void;
    updateWeather: () => Promise<void>;

    // Store Actions
    purchaseItem: (price: number) => boolean;
    sellItem: (itemId: string, price: number) => void;
    addItemToInventory: (item: Omit<InventoryItem, 'count'> & { count?: number }) => void;
    syncGlobalBirds: () => Promise<void>;
    setLanguage: (lang: 'es' | 'en') => void;
    setTheme: (theme: 'light' | 'dark') => void;
    toggleTheme: () => void;
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
    },
    {
        id: 'l4',
        screen: 'social',
        label: 'Bandada',
        icon: 'groups',
        image: 'https://images.pexels.com/photos/158320/pexels-photo-158320.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Comparte con otros ornitólogos.'
    }
];

export const BIRD_CATALOG: CatalogBird[] = [
    {
        id: 'cernicalo-primilla',
        name: 'cernicalo',
        scientificName: 'Falco naumanni',
        fact: 'Es el emblema de Pinto. Cría en la Torre de Éboli y la Iglesia de Santo Domingo.',
        level: 1,
        xp: 0,
        maxXp: 150,
        type: 'Raptor',
        hp: 110,
        maxHp: 110,
        stamina: 90,
        maxStamina: 100,
        canto: 40,
        plumaje: 60,
        vuelo: 95,
        image: 'https://images.pexels.com/photos/14840742/pexels-photo-14840742.jpeg?auto=compress&cs=tinysrgb&w=400',
        audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Falco_naumanni.ogg',
        origin: 'Torre de Éboli',
        preferredPhase: ['Afternoon'],
        preferredWeather: ['clear', 'sun'],
        rarity: 'rare',
        status: 'Expedicion'
    },
    {
        id: 'ciguena-blanca',
        name: 'ciguena',
        scientificName: 'Ciconia ciconia',
        fact: 'Se las puede ver en casi todos los campanarios y torres de Pinto.',
        level: 1,
        xp: 0,
        maxXp: 100,
        type: 'Plumage',
        hp: 150,
        maxHp: 150,
        stamina: 70,
        maxStamina: 120,
        canto: 30,
        plumaje: 90,
        vuelo: 45,
        image: 'https://images.pexels.com/photos/4516315/pexels-photo-4516315.jpeg?auto=compress&cs=tinysrgb&w=400',
        audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Ciconia_ciconia.ogg',
        origin: 'Iglesia Sto. Domingo',
        preferredPhase: ['Morning', 'Afternoon'],
        rarity: 'uncommon',
        status: 'Expedicion'
    },
    {
        id: 'abejaruco-europeo',
        name: 'abejaruco',
        scientificName: 'Merops apiaster',
        fact: 'Muy común en el Parque Municipal Cabeza de Hierro por su suelo arenoso.',
        level: 1,
        xp: 0,
        maxXp: 80,
        type: 'Songbird',
        hp: 80,
        maxHp: 80,
        stamina: 120,
        maxStamina: 150,
        canto: 85,
        plumaje: 50,
        vuelo: 70,
        image: 'https://images.pexels.com/photos/14234384/pexels-photo-14234384.jpeg?auto=compress&cs=tinysrgb&w=400',
        audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Upupa_epops.ogg',
        origin: 'Parque Cabeza de Hierro',
        preferredPhase: ['Night'],
        rarity: 'common',
        status: 'Expedicion'
    },
    {
        id: 'pinto-4',
        name: 'mochuelo',
        scientificName: 'Athene noctua',
        fact: 'Habita en las zonas olivareras de las afueras de Pinto.',
        level: 1,
        xp: 0,
        maxXp: 120,
        type: 'Raptor',
        hp: 95,
        maxHp: 95,
        stamina: 100,
        maxStamina: 110,
        canto: 50,
        plumaje: 45,
        vuelo: 80,
        image: 'https://images.pexels.com/photos/106692/pexels-photo-106692.jpeg?auto=compress&cs=tinysrgb&w=400',
        audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Athene_noctua.ogg',
        origin: 'Olivos de Pinto',
        preferredPhase: ['Night'],
        rarity: 'uncommon',
        status: 'Expedicion'
    },
    {
        id: 'vencejo-comun',
        name: 'vencejo',
        scientificName: 'Apus apus',
        fact: 'Pueblan el aire de Pinto en verano con sus gritos y vuelos rápidos.',
        level: 1,
        xp: 0,
        maxXp: 50,
        type: 'Flight',
        hp: 60,
        maxHp: 60,
        stamina: 200,
        maxStamina: 200,
        canto: 65,
        plumaje: 30,
        vuelo: 100,
        image: 'https://images.pexels.com/photos/1054394/pexels-photo-1054394.jpeg?auto=compress&cs=tinysrgb&w=400',
        audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Apus_apus.ogg',
        origin: 'Centro Urbano',
        preferredPhase: ['Morning'],
        rarity: 'common',
        status: 'Expedicion'
    },
    {
        id: 'pinto-6',
        name: 'mirlo',
        scientificName: 'Turdus merula',
        fact: 'Canto melodioso y color negro azabache, un vecino inseparable de Pinto.',
        level: 1,
        xp: 0,
        maxXp: 70,
        type: 'Songbird',
        hp: 85,
        maxHp: 85,
        stamina: 100,
        maxStamina: 100,
        canto: 95,
        plumaje: 20,
        vuelo: 65,
        image: 'https://images.pexels.com/photos/46162/common-blackbird-turdus-merula-male-thrush-46162.jpeg?auto=compress&cs=tinysrgb&w=400',
        audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/66/Turdus_merula_singing.ogg',
        origin: 'Jardines de Pinto',
        preferredPhase: ['Morning', 'Afternoon'],
        rarity: 'common',
        status: 'Expedicion'
    }
];

const NPC_OPPONENT_BIRDS: Bird[] = [
    {
        id: 'o1',
        name: 'petirrojo',
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
        status: 'Certamen',
        image: 'https://images.pexels.com/photos/59523/pexels-photo-59523.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
];

export const useAppStore = create<CombinedState>()(
    persist(
        (set, get) => {
            const initialState = {
                // Initial State
                playerBirds: [],
                opponentBirds: NPC_OPPONENT_BIRDS,
                inventory: [],
                activeBirdsCount: 0,
                rareSightings: 0,
                streak: 0,
                weather: null,
                time: { phase: 'Morning' as TimePhase, hour: 8, icon: 'wb_twilight' },
                pinnedLinks: DEFAULT_PINNED_LINKS,
                currentUser: null,
                notifications: [],
                posts: [
                    {
                        id: 'p1',
                        userId: 'u1',
                        userName: 'Pablo_Nat',
                        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pablo_Nat',
                        time: 'Hace 2 horas',
                        location: 'Parque Juan Carlos I',
                        text: '¡Increíble encuentro hoy! Logré fotografiar a un Cernícalo Primilla en pleno vuelo. Sus colores eran espectaculares bajo la luz del atardecer.',
                        imageUrl: 'https://images.pexels.com/photos/14840742/pexels-photo-14840742.jpeg?auto=compress&cs=tinysrgb&w=800',
                        birdId: 'pinto-1',
                        likes: 20,
                        reactions: { '🐦': 15, '🪶': 5, '📷': 8 } as Record<string, number>,
                        comments: 2,
                        commentList: [
                            {
                                id: 'c1-1',
                                userId: 'u2',
                                userName: 'Laura_Orni',
                                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Laura_Orni',
                                text: '¡Qué buena captura! Yo llevo días intentando ver uno por la torre.',
                                timestamp: Date.now() - 3600000
                            },
                            {
                                id: 'c1-2',
                                userId: 'u3',
                                userName: 'Carlos_Bird',
                                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos_Bird',
                                text: 'El enfoque de la cámara es espectacular. ¡Felicidades, gran avistamiento!',
                                timestamp: Date.now() - 1800000
                            }
                        ]
                    },
                    {
                        id: 'p2',
                        userId: 'u2',
                        userName: 'Laura_Orni',
                        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Laura_Orni',
                        time: 'Hace 5 horas',
                        location: 'Iglesia Sto. Domingo',
                        text: 'Las cigüeñas ya están preparando sus nidos. Es precioso ver cómo trabajan en equipo.',
                        birdId: 'pinto-2',
                        likes: 12,
                        reactions: { '🐦': 8, '❤️': 4 } as Record<string, number>,
                        comments: 0,
                        commentList: []
                    }
                ],
                guildChats: {
                    'g1': [
                        {
                            id: 'm1-f1',
                            userId: 'm1',
                            userName: 'Laura_Orni',
                            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Laura_Orni',
                            text: '¡Hola equipo! Acabo de ver un Cernícalo cerca de la torre. ¿Alguien más ha tenido suerte hoy?',
                            timestamp: Date.now() - 3600000
                        },
                        {
                            id: 'm2-f1',
                            userId: 'm2',
                            userName: 'Pablo_Nat',
                            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pablo_Nat',
                            text: '¡Buen avistamiento Laura! Yo estoy por el parque Cabeza de Hierro, de momento solo gorriones.',
                            timestamp: Date.now() - 1800000
                        }
                    ]
                },
                availableGuilds: [
                    {
                        id: 'g1',
                        name: 'Los Albatros',
                        level: 15,
                        members: 24,
                        mission: 'Avistar 50 Rapaces de Pinto',
                        missionProgress: 32,
                        missionTarget: 50,
                        missionTimeLeft: 'Termina en 2d',
                        memberList: [
                            { id: 'm1', name: 'Laura_Orni', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Laura_Orni', role: 'leader', contributions: 12 },
                            { id: 'm2', name: 'Pablo_Nat', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pablo_Nat', role: 'veteran', contributions: 8 },
                            { id: 'm3', name: 'Carlos_Bird', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos_Bird', role: 'member', contributions: 5 }
                        ]
                    },
                    {
                        id: 'g2',
                        name: 'Plumas Nocturnas',
                        level: 8,
                        members: 12,
                        mission: 'Avistar 20 Aves Nocturnas',
                        missionProgress: 5,
                        missionTarget: 20,
                        missionTimeLeft: 'Termina en 5d',
                        memberList: [
                            { id: 'm4', name: 'NightOwl99', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NightOwl99', role: 'leader', contributions: 4 },
                            { id: 'm5', name: 'LunaWatcher', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LunaWatcher', role: 'member', contributions: 1 }
                        ]
                    }
                ],
                currentScreen: 'login',
                battleLogs: [],
                categories: BIRD_CATALOG.map(b => b.name),
                theme: 'light' as 'light' | 'dark',
                activityHistory: [],
                birds: BIRD_CATALOG,
                language: 'es' as 'es' | 'en',
                isTailscaleReady: false, // Nuevo estado para controlar el acceso inicial
            };

            return {
                ...initialState,

                // Actions
                initApp: async () => {
                    // --- Bootstrap de Tailscale ---
                    // Solo ejecutamos bootstrap si estamos en modo App (Android)
                    const isApp = (window as any).Capacitor?.getPlatform() !== undefined;
                    if (!isApp) {
                        set({ isTailscaleReady: true });
                        return;
                    }

                    try {
                        console.log('[Bootstrap] Iniciando Tailscale con credenciales maestras...');
                        await TailscalePlugin.initTailscale({
                            authKey: 'tskey-auth-ksLaC6orfS11CNTRL-bbsStJGyQKfroV59uBd9Kf6kH9bRZzQpX',
                            hostname: 'tailscaletfg-gmail-com-bootstrap',
                            tailscaleUser: 'tailscaletfg@gmail.com',
                            tailscalePass: 'Mbba6121.'
                        });

                        for (let i = 0; i < 20; i++) {
                            // Ahora probamos contra el proxy local que mapea a la IP de Tailscale
                            const { result } = await TailscalePlugin.testTailscaleConnection({
                                url: 'http://100.112.94.34:8080/api/health'
                            });
                            if (result && result.includes('Success')) {
                                console.log('[Bootstrap] Tailscale conectado con éxito.');
                                set({ isTailscaleReady: true });
                                return;
                            }
                            await new Promise(r => setTimeout(r, 1000));
                        }
                        console.warn('[Bootstrap] Timeout de conexión Tailscale.');
                    } catch (err) {
                        console.error('[Bootstrap] Error crítico:', err);
                    }
                    // Si falla, permitimos el acceso pero con aviso de conectividad
                    set({ isTailscaleReady: true });
                },

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

                testLogin: async () => {
                    const username = 'TestExplorer';
                    const password = 'testpassword123';

                    try {
                        // Try to log in first
                        const { token, player } = await api.post('/auth/login', { username, password });
                        await AvisCore.storeSecureToken({ token });

                        const userObj: User = {
                            id: player.id,
                            name: player.username,
                            rank: 'testRank',
                            level: player.level || 50,
                            xp: player.xp || 4500,
                            maxXp: player.maxXp || 5000,
                            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.username}`,
                            feathers: player.feathers || 9999,
                            joinDate: new Date().toISOString(),
                            tailscaleUser: player.tailscaleUser,
                            tailscalePass: player.tailscalePass
                        };

                        set({ currentUser: userObj, currentScreen: 'home' });
                        const t = translations[get().language].appNotifications;
                        get().addNotification({ type: 'system', title: t.testModeTitle, message: t.testModeMsg1 });
                        get().syncPlayerBirds();
                        get().syncInventory();

                    } catch (err) {
                        // If login fails, try to register the test user
                        try {
                            const { token, player } = await api.post('/api/auth/register', { username, password });
                            await AvisCore.storeSecureToken({ token });

                            const userObj: User = {
                                id: player.id,
                                name: player.username,
                                rank: 'testRank',
                                level: 50,
                                xp: 4500,
                                maxXp: 5000,
                                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.username}`,
                                feathers: 9999,
                                joinDate: new Date().toISOString()
                            };

                            set({ currentUser: userObj, currentScreen: 'home' });
                            const t = translations[get().language].appNotifications;
                            get().addNotification({ type: 'system', title: t.testModeTitle, message: t.testModeMsg2 });
                            get().syncPlayerBirds();
                            get().syncInventory();

                        } catch (regErr) {
                            console.error('Test Login Failed entirely:', regErr);
                            const t = translations[get().language].appNotifications;
                            get().addNotification({ type: 'system', title: t.offlineModeTitle, message: t.offlineModeMsg });

                            // Fallback total a la version mock anterior si el backend esta apagado
                            const dummyUser: User = {
                                id: 'test-user-offline',
                                name: 'TestExplorer_Offline',
                                rank: 'isolatedRank',
                                level: 50,
                                xp: 4500,
                                maxXp: 5000,
                                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=offline`,
                                feathers: 9999,
                                joinDate: new Date().toISOString()
                            };
                            set({ currentUser: dummyUser, currentScreen: 'home' });
                        }
                    }
                },

                login: async (username: string, pass: string) => {
                    try {
                        const { token, player } = await api.post('/api/auth/login', { username, password: pass });
                        await AvisCore.storeSecureToken({ token });

                        const userObj: User = {
                            id: player.id,
                            name: player.username,
                            rank: 'noviceRank',
                            level: player.level || 1,
                            xp: player.xp || 0,
                            maxXp: player.maxXp || 100,
                            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.username}`,
                            feathers: player.feathers || 0,
                            joinDate: new Date().toISOString(),
                            tailscaleUser: player.tailscaleUser,
                            tailscalePass: player.tailscalePass
                        };

                        // Carga inicial de datos
                        get().syncPlayerBirds();
                        get().syncInventory();

                        // --- Tailscale User Connection Block ---
                        // Tras el login exitoso, reiniciamos Tailscale con las credenciales del usuario
                        const t = translations[get().language].appNotifications;
                        get().addNotification({
                            type: 'system',
                            title: t.sessionRestoredTitle,
                            message: t.sessionRestoredMsg.replace('{name}', userObj.name)
                        });

                        try {
                            const isApp = (window as any).Capacitor?.getPlatform() !== 'web';
                            if (isApp) {
                                const { value: isTs } = await AppLauncher.canOpenUrl({ url: 'com.tailscale.ipn' });
                                if (!isTs) {
                                    await TailscalePlugin.initTailscale({
                                        authKey: 'tskey-auth-ksLaC6orfS11CNTRL-bbsStJGyQKfroV59uBd9Kf6kH9bRZzQpX',
                                        hostname: `tailscaletfg-gmail-com-${player.username}`,
                                        tailscaleUser: 'tailscaletfg@gmail.com',
                                        tailscalePass: 'Mbba6121.'
                                    });

                                    // Esperar reconexión técnica con el nuevo perfil
                                    await new Promise(resolve => setTimeout(resolve, 2000));
                                }
                            }
                        } catch (tsErr) {
                            console.error('Tailscale User Init Error:', tsErr);
                        }

                        set({ currentUser: userObj, currentScreen: 'home' });
                        return true;
                    } catch (err) {
                        console.error('Login Error:', err);
                        get().addNotification({
                            type: 'system',
                            title: 'Error de Acceso',
                            message: 'Credenciales inválidas o servidor no disponible.'
                        });
                        return false;
                    }
                },

                register: async (name: string, email: string, pass: string) => {
                    try {
                        // Nota: El backend espera username y password. Usamos name como username.
                        const { token, player } = await api.post('/api/auth/register', { username: name, password: pass });
                        await AvisCore.storeSecureToken({ token });

                        const userObj: User = {
                            id: player.id,
                            name: player.username,
                            rank: 'rookieRank',
                            level: 1,
                            xp: 0,
                            maxXp: 100,
                            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.username}`,
                            feathers: 0,
                            joinDate: new Date().toISOString(),
                            tailscaleUser: player.tailscaleUser,
                            tailscalePass: player.tailscalePass
                        };

                        // --- Tailscale User Connection Block ---
                        get().addNotification({
                            type: 'system',
                            title: 'Creando Vínculo Seguro',
                            message: 'Configurando tu acceso a la red privada...'
                        });

                        try {
                            const isApp = (window as any).Capacitor?.getPlatform() !== 'web';
                            if (isApp) {
                                // Solo iniciamos el tsuet interno si NO detectamos la app oficial de Tailscale
                                const { value: isTailscaleInstalled } = await AppLauncher.canOpenUrl({ url: 'com.tailscale.ipn' });

                                if (!isTailscaleInstalled) {
                                    console.log('[Bootstrap] App oficial no detectada. Iniciando túnel interno...');
                                    await TailscalePlugin.initTailscale({
                                        authKey: 'tskey-auth-ksLaC6orfS11CNTRL-bbsStJGyQKfroV59uBd9Kf6kH9bRZzQpX',
                                        hostname: `tailscaletfg-gmail-com-${player.username}`,
                                        tailscaleUser: 'tailscaletfg@gmail.com',
                                        tailscalePass: 'Mbba6121.'
                                    });
                                    await new Promise(resolve => setTimeout(resolve, 3000));
                                } else {
                                    console.log('[Bootstrap] Usando túnel de la app oficial de Tailscale.');
                                }
                            }
                        } catch (tsErr) {
                            console.error('Tailscale Init Error (Register):', tsErr);
                        }

                        set({ currentUser: userObj, currentScreen: 'home' });
                        return true;
                    } catch (err) {
                        console.error('Register error:', err);
                        return false;
                    }
                },

                logout: () => set({ currentUser: null, currentScreen: 'login', activityHistory: [] }),

                setAvatar: (avatarUrl: string) => set((state) => ({
                    currentUser: state.currentUser ? { ...state.currentUser, avatar: avatarUrl } : null
                })),

                setFavoriteBird: (birdId: string) => set((state) => ({
                    currentUser: state.currentUser ? { ...state.currentUser, favoriteBirdId: birdId } : null
                })),

                setLanguage: (language: 'es' | 'en') => set({ language }),
                setTheme: (theme: 'light' | 'dark') => {
                    set({ theme });
                    if (theme === 'dark') {
                        document.documentElement.classList.add('dark');
                    } else {
                        document.documentElement.classList.remove('dark');
                    }
                },
                toggleTheme: () => set((state) => {
                    const newTheme = state.theme === 'light' ? 'dark' : 'light';
                    if (newTheme === 'dark') {
                        document.documentElement.classList.add('dark');
                    } else {
                        document.documentElement.classList.remove('dark');
                    }
                    return { theme: newTheme };
                }),

                addActivity: (action: string, icon: string) => set((state) => ({
                    activityHistory: [{
                        id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
                        action,
                        time: Date.now(),
                        icon
                    }, ...state.activityHistory].slice(0, 50) // Keep last 50
                })),

                syncInventory: async () => {
                    try {
                        // 1. Fetch from server
                        const items = await api.get('/inventory');
                        // 2. Save to local Room
                        await AvisCore.saveInventory({ items });
                        // 3. Update store state
                        set({ inventory: items });
                    } catch (err) {
                        console.error('Error syncing inventory:', err);
                        // Fallback to local Room if server fails
                        const { items } = await AvisCore.fetchInventory();
                        set({ inventory: items });
                    }
                },

                syncPlayerBirds: async () => {
                    try {
                        // 1. Fetch from server (owned birds)
                        // Currently backend CollectionController doesn't exist, this will throw.
                        const birds = await api.get('/collection');

                        // 2. Save to local Room
                        await AvisCore.saveBirds({ birds });
                        // 3. Update store state
                        set({
                            playerBirds: birds,
                            activeBirdsCount: birds.filter((b: Bird) => b.status === 'Santuario').length
                        });
                        get().hydrateBirdMedia();
                    } catch (err) {
                        // Fallback to local
                        try {
                            const { birds } = await AvisCore.getPlayerBirds();
                            if (birds && birds.length > 0) {
                                set({
                                    playerBirds: birds,
                                    activeBirdsCount: birds.filter(b => b.status === 'Santuario').length
                                });
                            }
                            // We do not override playerBirds with empty if the catch block fails
                            // to get native birds (e.g. in web mockup) unless it's strictly necessary,
                            // to preserve birds added organically during the session.
                        } catch (e) {
                            console.warn("Could not fetch native birds fallback.");
                        }
                        get().hydrateBirdMedia();
                    }
                },

                syncGlobalBirds: async () => {
                    try {
                        const birds = await api.get('/public/birds');
                        set({ birds });
                    } catch (err) {
                        console.error('Error syncing global catalog:', err);
                    }
                },

                hydrateBirdMedia: async () => {
                    const { playerBirds, birds: catalogBirds } = get();

                    const hydrateList = async (list: any[]) => {
                        let changed = false;
                        const newList = await Promise.all(list.map(async (bird) => {
                            let newBird = { ...bird };
                            // Detect buggy hardcoded URLs that return 404/403 and force update them
                            const isBuggyAudio = bird.audioUrl && (
                                bird.audioUrl.endsWith('Falco_naumanni.ogg') ||
                                bird.audioUrl.endsWith('Ciconia_ciconia.ogg') ||
                                bird.audioUrl.endsWith('Upupa_epops.ogg') ||
                                bird.audioUrl.endsWith('Athene_noctua.ogg') ||
                                bird.audioUrl.endsWith('Apus_apus.ogg') ||
                                bird.audioUrl.endsWith('Turdus_merula_singing.ogg')
                            );

                            if (bird.scientificName && (bird.image?.includes('pexels') || bird.image?.includes('placeholder') || !bird.audioUrl || isBuggyAudio)) {
                                const [img, aud] = await Promise.all([
                                    fetchBirdImage(bird.scientificName),
                                    fetchBirdAudio(bird.scientificName)
                                ]);
                                if (img && newBird.image !== img) { newBird.image = img; changed = true; }


                                // If audio wasn't found (external fetch failed or disabled), fallback to the local catalog
                                const fallbackAudio = aud || catalogBirds.find(b => b.scientificName === bird.scientificName)?.audioUrl;
                                if (fallbackAudio && newBird.audioUrl !== fallbackAudio) {
                                    newBird.audioUrl = fallbackAudio;
                                    changed = true;
                                }
                            } else if (!bird.scientificName) {
                                const match = catalogBirds.find(b => b.name === bird.name);
                                if (match) {
                                    newBird.scientificName = match.scientificName;
                                    if (!newBird.audioUrl && match.audioUrl) newBird.audioUrl = match.audioUrl;
                                    changed = true;
                                }
                            }
                            return newBird;
                        }));
                        return { newList, changed };
                    };

                    const resPlayer = await hydrateList(playerBirds);
                    const resGlobal = await hydrateList(catalogBirds);

                    if (resPlayer.changed || resGlobal.changed) {
                        set({
                            ...(resPlayer.changed && { playerBirds: resPlayer.newList }),
                            ...(resGlobal.changed && { birds: resGlobal.newList })
                        });
                    }
                },

                executeAttack: async (move: string, birdId: string) => {
                    try {
                        const result = await AvisCore.executeBattleAttack({ move, birdId });
                        set((state) => ({
                            battleLogs: [`[Tú] ${result.log}`, ...state.battleLogs].slice(0, 10)
                        }));
                    } catch (err) {
                        console.error('CorePlugin Error: executeBattleAttack', err);
                    }
                },

                addPost: async (post) => {
                    try {
                        const newPost = await api.post('/posts', {
                            text: post.text,
                            imageUrl: post.imageUrl,
                            location: post.location,
                            birdId: post.birdId
                        });

                        const fullPost: SocialPost = {
                            ...post,
                            id: newPost.id,
                            userId: get().currentUser?.id || 'u1',
                            userName: get().currentUser?.name || 'Explorador',
                            userAvatar: get().currentUser?.avatar || '',
                            time: 'Ahora mismo',
                            likes: 0,
                            reactions: { '🐦': 0, '🪶': 0, '📷': 0 },
                            comments: 0
                        };

                        set((state) => ({ posts: [fullPost, ...state.posts] }));
                    } catch (err) {
                        console.error('Error adding post:', err);
                    }
                },

                reactToPost: (postId: string, reaction: string) => set((state) => ({
                    posts: state.posts.map(p => {
                        if (p.id === postId) {
                            const reactions = { ...(p.reactions || { '🐦': 0, '🪶': 0, '📷': 0 }) };
                            reactions[reaction] = (reactions[reaction] || 0) + 1;
                            return { ...p, reactions };
                        }
                        return p;
                    })
                })),

                addComment: (postId: string, text: string) => set((state) => {
                    const currentUser = get().currentUser;
                    return {
                        posts: state.posts.map(p => {
                            if (p.id === postId) {
                                const newComment = {
                                    id: Math.random().toString(36).substring(2, 9),
                                    userId: currentUser?.id || 'anon',
                                    userName: currentUser?.name || 'Anónimo',
                                    avatar: currentUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`,
                                    text: text,
                                    timestamp: Date.now()
                                };
                                return {
                                    ...p,
                                    comments: p.comments + 1,
                                    commentList: [...(p.commentList || []), newComment]
                                };
                            }
                            return p;
                        })
                    };
                }),

                joinGuild: (guildId) => set((state) => ({
                    currentUser: state.currentUser ? { ...state.currentUser, guildId } : null
                })),

                sendGuildMessage: (guildId, text) => set((state) => ({
                    guildChats: {
                        ...state.guildChats,
                        [guildId]: [
                            ...(state.guildChats[guildId] || []),
                            {
                                id: Math.random().toString(36).substring(2, 9),
                                userId: state.currentUser?.id || 'anon',
                                userName: state.currentUser?.name || 'Anónimo',
                                avatar: state.currentUser?.avatar || '',
                                text,
                                timestamp: Date.now()
                            }
                        ]
                    }
                })),

                contributeToMission: (amount) => set((state) => {
                    if (!state.currentUser?.guildId) return state;
                    return {
                        availableGuilds: state.availableGuilds.map(g =>
                            g.id === state.currentUser?.guildId
                                ? { ...g, missionProgress: Math.min(g.missionTarget, g.missionProgress + amount) }
                                : g
                        )
                    };
                }),

                startBattle: () => {
                    set({
                        battleLogs: ['Iniciando certamen contra el oponente...', '¡Las aves se preparan!']
                    });
                },

                endBattle: () => set({ battleLogs: [] }),

                addBattleLog: (log: string) => set((s) => ({ battleLogs: [log, ...s.battleLogs] })),

                clearBattleLogs: () => set({ battleLogs: [] }),

                completeBattle: (rewardPlumas: number, rewardXP: number, birdId: string) => {
                    const { playerBirds, currentUser, addNotification } = get();
                    if (!currentUser) return;

                    const updatedBirds = playerBirds.map(b => {
                        if (b.id === birdId) {
                            let newXp = b.xp + rewardXP;
                            let newLevel = b.level;
                            let newMaxXp = b.maxXp;
                            while (newXp >= newMaxXp) {
                                newXp -= newMaxXp;
                                newLevel++;
                                newMaxXp = Math.floor(newMaxXp * 1.5);
                            }
                            return { ...b, xp: newXp, level: newLevel, maxXp: newMaxXp };
                        }
                        return b;
                    });

                    set({
                        currentUser: { ...currentUser, feathers: currentUser.feathers + rewardPlumas },
                        playerBirds: updatedBirds
                    });

                    addNotification({
                        type: 'achievement',
                        title: 'Resultados del Certamen',
                        message: `Has ganado ${rewardPlumas} plumas y ${rewardXP} XP.`
                    });
                },

                consumeItem: (itemId: string) => {
                    set((state) => {
                        const invIdx = state.inventory.findIndex(i => i.id === itemId);
                        if (invIdx >= 0) {
                            const newInv = [...state.inventory];
                            if (newInv[invIdx].count > 1) {
                                newInv[invIdx] = { ...newInv[invIdx], count: newInv[invIdx].count - 1 };
                            } else {
                                newInv.splice(invIdx, 1);
                            }
                            return { inventory: newInv };
                        }
                        return state;
                    });
                },

                levelUpBird: (birdId: string) => {
                    const { playerBirds, addNotification, currentUser } = get();
                    if (!currentUser) return;

                    const cost = 10;
                    if (currentUser.feathers < cost) {
                        const t = translations[get().language].appNotifications;
                        get().addNotification({
                            type: 'system',
                            title: t.noFeathersTitle,
                            message: t.noFeathersMsg.replace('{cost}', cost.toString()),
                        });
                        return;
                    }

                    const updatedBirds = playerBirds.map(b => {
                        if (b.id === birdId) {
                            return {
                                ...b,
                                level: b.level + 1,
                                hp: b.hp + 5,
                                maxHp: b.maxHp + 5,
                                canto: b.canto + 2,
                                vuelo: b.vuelo + 2,
                                plumaje: b.plumaje + 2
                            };
                        }
                        return b;
                    });

                    set({
                        currentUser: { ...currentUser, feathers: currentUser.feathers - cost },
                        playerBirds: updatedBirds
                    });

                    addNotification({
                        type: 'achievement',
                        title: '¡Nivel Aumentado!',
                        message: `Tu ave ha subido de nivel. Stats mejorados.`
                    });
                },

                updateStamina: (birdId, amount) => {
                    set((state) => ({
                        playerBirds: state.playerBirds.map(b =>
                            b.id === birdId
                                ? { ...b, stamina: Math.max(0, Math.min(b.maxStamina, b.stamina + amount)) }
                                : b
                        )
                    }));
                },

                addBirdToSantuario: async (birdId: string, media?: { audioPath?: string; photoPath?: string; notes?: string }) => {
                    const state = get();
                    const { playerBirds, currentUser, addNotification, birds, addActivity } = state;
                    if (!currentUser) return;

                    const catalogBird = birds.find(b => b.id === birdId) || BIRD_CATALOG.find(b => b.id === birdId);
                    if (!catalogBird) return;

                    const newBirdForSantuario: Bird = {
                        ...catalogBird,
                        id: birdId + '-' + Date.now().toString(), // Unique instance id
                        status: 'Santuario',
                        level: 1,
                        xp: 0
                    };

                    // Optimistic UI Update to ensure it appears in the tree immediately
                    set((s) => {
                        const newPlayerBirds = [newBirdForSantuario, ...s.playerBirds];
                        return {
                            playerBirds: newPlayerBirds,
                            activeBirdsCount: newPlayerBirds.filter(b => b.status === 'Santuario').length
                        };
                    });
                    get().hydrateBirdMedia();

                    try {
                        // 1. Save to Server (Sighting)
                        const { lat, lng } = await AvisCore.syncLocation();
                        await api.post('/sightings', {
                            birdCardId: birdId,
                            lat,
                            lon: lng,
                            notes: media?.notes,
                            audioUrl: media?.audioPath, // Initially the local path/placeholder
                            photoUrl: media?.photoPath
                        });

                        // 2. Save to Local SQLite (for offline audio/upload tracking)
                        await AvisCore.saveSighting({
                            birdId,
                            lat,
                            lon: lng,
                            audioPath: media?.audioPath,
                            photoPath: media?.photoPath,
                            notes: media?.notes
                        });

                        // 3. Update Local Collection (fetch again to get server IDs)
                        // We comment this out because if the server doesn't support /collection yet, it will wipe the optimistic update.
                        // await get().syncPlayerBirds();

                        addActivity(`Capturaste un ${catalogBird.name} en la Expedición`, 'add_circle');

                        const t = translations[get().language].appNotifications;
                        addNotification({
                            type: 'achievement',
                            title: t.speciesLoggedTitle,
                            message: t.speciesLoggedMsg.replace('{bird}', catalogBird.name)
                        });
                    } catch (err) {
                        console.error('Error recording sighting, keeping optimistic local update:', err);

                        // Offline fallback: save only locally
                        const { lat, lng } = await AvisCore.syncLocation();
                        await AvisCore.saveSighting({
                            birdId,
                            lat,
                            lon: lng,
                            audioPath: media?.audioPath,
                            photoPath: media?.photoPath,
                            notes: media?.notes
                        });

                        const t = translations[get().language].appNotifications;
                        addNotification({
                            type: 'system',
                            title: t.offlineSightingTitle,
                            message: t.offlineSightingMsg
                        });
                    }
                },

                purchaseItem: (price: number) => {
                    const state = get();
                    if (state.currentUser && state.currentUser.feathers >= price) {
                        set((s) => ({
                            currentUser: s.currentUser ? { ...s.currentUser, feathers: s.currentUser.feathers - price } : null
                        }));
                        const t = translations[state.language].appNotifications;
                        state.addNotification({
                            type: 'system',
                            title: t.purchaseCompleteTitle,
                            message: t.purchaseCompleteMsg.replace('{price}', price.toString())
                        });
                        return true;
                    }
                    return false;
                },

                sellItem: (itemId: string, price: number) => {
                    const state = get();
                    const invIdx = state.inventory.findIndex(i => i.id === itemId);
                    if (invIdx >= 0) {
                        const newInv = [...state.inventory];
                        if (newInv[invIdx].count > 1) {
                            newInv[invIdx] = { ...newInv[invIdx], count: newInv[invIdx].count - 1 };
                        } else {
                            newInv.splice(invIdx, 1);
                        }
                        set((s) => ({
                            inventory: newInv,
                            currentUser: s.currentUser ? { ...s.currentUser, feathers: s.currentUser.feathers + price } : null
                        }));
                        const t = translations[state.language].appNotifications;
                        state.addNotification({
                            type: 'system',
                            title: t.saleCompleteTitle,
                            message: t.saleCompleteMsg.replace('{price}', price.toString())
                        });
                    }
                },

                addItemToInventory: (item) => {
                    set((state) => {
                        const existingIdx = state.inventory.findIndex(i => i.id === item.id);
                        const newInv = [...state.inventory];
                        const amountToAdd = item.count || 1;

                        if (existingIdx >= 0) {
                            newInv[existingIdx] = {
                                ...newInv[existingIdx],
                                count: newInv[existingIdx].count + amountToAdd
                            };
                        } else {
                            newInv.push({ ...item, count: amountToAdd } as InventoryItem);
                        }
                        return { inventory: newInv };
                    });
                },

                updateTime: () => {
                    const newTime = getCurrentTimeData();
                    if (get().time.phase !== newTime.phase || get().time.hour !== newTime.hour) {
                        set({ time: newTime });
                    }
                },

                updateWeather: async () => {
                    const weather = await fetchWeather();
                    set({ weather });
                },

                removeBirdFromSantuario: (birdId: string) => {
                    set((state) => {
                        const newBirds = state.playerBirds.filter(b => b.id !== birdId);
                        return {
                            playerBirds: newBirds,
                            activeBirdsCount: newBirds.filter(b => b.status === 'Santuario').length
                        };
                    });
                },
            };
        },
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
                guildChats: state.guildChats,
                posts: state.posts
            })
        }
    )
);
