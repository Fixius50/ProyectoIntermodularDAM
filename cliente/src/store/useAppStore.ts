import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AvisCore from '../services/avisCore';
import { fetchWeather } from '../services/weather';
import { getCurrentTimeData } from '../services/time';
import { fetchBirdImage, fetchBirdAudio } from '../services/birdMediaApi';
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
    InventoryItem
} from '../types';

interface AppActions {
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
    register: (name: string, email: string, pass: string) => Promise<boolean>;
    logout: () => void;
    syncInventory: () => Promise<void>;
    syncPlayerBirds: () => Promise<void>;
    hydrateBirdMedia: () => Promise<void>;
    executeAttack: (move: string, birdId: string) => Promise<void>;

    // Social Actions
    addPost: (post: Omit<SocialPost, 'id' | 'time' | 'likes' | 'comments' | 'reactions' | 'userId' | 'userName' | 'userAvatar'>) => void;
    reactToPost: (postId: string, reaction: string) => void;
    addComment: (postId: string) => void;

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
    addBirdToSantuario: (birdId: string) => void;
    levelUpBird: (birdId: string) => void;

    // Environment Actions
    updateTime: () => void;
    updateWeather: () => Promise<void>;

    // Store Actions
    purchaseItem: (price: number) => boolean;
    sellItem: (itemId: string, price: number) => void;
    addItemToInventory: (item: Omit<InventoryItem, 'count'> & { count?: number }) => void;
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
        id: 'pinto-1',
        name: 'Cernícalo Primilla',
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
        id: 'pinto-2',
        name: 'Cigüeña Blanca',
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
        id: 'pinto-3',
        name: 'Abubilla',
        scientificName: 'Upupa epops',
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
        preferredPhase: ['Morning', 'Afternoon'],
        rarity: 'common',
        status: 'Expedicion'
    },
    {
        id: 'pinto-4',
        name: 'Mochuelo Común',
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
        id: 'pinto-5',
        name: 'Vencejo Común',
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
        name: 'Mirlo Común',
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
        name: 'Petirrojo Europeo',
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
        (set, get) => ({
            // Initial State
            playerBirds: [],
            opponentBirds: NPC_OPPONENT_BIRDS,
            inventory: [],
            activeBirdsCount: 0,
            rareSightings: 0,
            streak: 0,
            weather: null,
            time: { phase: 'Morning', hour: 8, icon: 'wb_twilight' },
            pinnedLinks: DEFAULT_PINNED_LINKS,
            currentUser: null,
            notifications: [],
            posts: [
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
                }
            ],
            guildChats: {},
            availableGuilds: [
                {
                    id: 'g1',
                    name: 'Los Albatros',
                    level: 15,
                    members: 24,
                    mission: 'Avistar 50 Rapaces de Pinto',
                    missionProgress: 32,
                    missionTarget: 50,
                    missionTimeLeft: 'Termina en 2d'
                }
            ],
            currentScreen: 'login',
            battleLogs: [],
            categories: ['Oop', 'Gaviota', 'Herrerillo', 'Golondrina', 'Cuervo', 'Águila', 'Búho'],
            activityHistory: [],
            birds: BIRD_CATALOG,

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

                    get().addNotification({
                        type: 'system',
                        title: 'Santuario Abierto',
                        message: `¡Bienvenido de nuevo, ${email.split('@')[0]}! El bosque te echaba de menos.`
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
                        currentScreen: 'home',
                        activityHistory: [{
                            id: Date.now().toString(),
                            action: `Te uniste a AVIS, ${name}`,
                            time: Date.now(),
                            icon: 'card_membership'
                        }]
                    });

                    get().addNotification({
                        type: 'achievement',
                        title: '¡Carnet de Ornitólogo!',
                        message: `Te damos la bienvenida a AVIS, ${name}. Has recibido tus primeras 10 plumas de inicio.`
                    });

                    return true;
                }
                return false;
            },

            logout: () => set({ currentUser: null, currentScreen: 'login', activityHistory: [] }),

            setAvatar: (avatarUrl: string) => set((state) => ({
                currentUser: state.currentUser ? { ...state.currentUser, avatar: avatarUrl } : null
            })),

            setFavoriteBird: (birdId: string) => set((state) => ({
                currentUser: state.currentUser ? { ...state.currentUser, favoriteBirdId: birdId } : null
            })),

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
                    const state = get();
                    if (state.inventory.length > 0) return;
                    const { items } = await AvisCore.fetchInventory();
                    set({ inventory: items });
                } catch (err) {
                    console.error('CorePlugin Error: fetchInventory', err);
                }
            },

            syncPlayerBirds: async () => {
                try {
                    const state = get();
                    if (state.playerBirds.length > 0) {
                        get().hydrateBirdMedia();
                        return;
                    }
                    const { birds } = await AvisCore.getPlayerBirds();
                    set({
                        playerBirds: birds,
                        activeBirdsCount: birds.filter(b => b.status === 'Santuario').length
                    });
                    get().hydrateBirdMedia();
                } catch (err) {
                    console.error('CorePlugin Error: getPlayerBirds', err);
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

            addPost: (post) => set((state) => ({
                posts: [{
                    ...post,
                    id: Math.random().toString(36).substring(2, 9),
                    userId: state.currentUser?.id || 'u1',
                    userName: state.currentUser?.name || 'Explorador',
                    userAvatar: state.currentUser?.avatar || '',
                    time: 'Ahora mismo',
                    likes: 0,
                    reactions: { '🐦': 0, '🪶': 0, '📷': 0 },
                    comments: 0
                } as SocialPost, ...state.posts]
            })),

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

            addComment: (postId) => set((state) => ({
                posts: state.posts.map(p => p.id === postId ? { ...p, comments: p.comments + 1 } : p)
            })),

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
                    addNotification({
                        type: 'system',
                        title: 'Sin Plumas',
                        message: `Necesitas ${cost} plumas para subir de nivel a esta ave.`,
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
                    playerBirds: updatedBirds,
                    currentUser: { ...currentUser, feathers: currentUser.feathers - cost }
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

            addBirdToSantuario: (birdId: string) => {
                const state = get();
                const { playerBirds, currentUser, addNotification, birds, addActivity } = state;
                if (!currentUser) return;

                const catalogBird = birds.find(b => b.id === birdId) || BIRD_CATALOG.find(b => b.id === birdId);
                if (!catalogBird) return;

                // Check if already captured (optional logic, usually we want duplicates allowed or just one per species)
                // For now, let's allow adding it as a new "individual" bird
                const newBird: Bird = {
                    ...catalogBird,
                    id: `${birdId}-${Date.now()}`, // Unique instance ID
                    status: 'Santuario'
                };

                set({
                    playerBirds: [...playerBirds, newBird],
                    currentUser: {
                        ...currentUser,
                        feathers: currentUser.feathers + 1,
                        xp: currentUser.xp + 50
                    }
                });

                addActivity(`Capturaste un ${catalogBird.name} en la Expedición`, 'add_circle');

                // Handle level up on user
                const newState = get();
                if (newState.currentUser && newState.currentUser.xp >= newState.currentUser.maxXp) {
                    set({
                        currentUser: {
                            ...newState.currentUser,
                            xp: newState.currentUser.xp - newState.currentUser.maxXp,
                            level: newState.currentUser.level + 1,
                            maxXp: Math.floor(newState.currentUser.maxXp * 1.5)
                        }
                    });
                    addNotification({
                        type: 'achievement',
                        title: '¡Rango de Naturalista Subido!',
                        message: `Has alcanzado el nivel ${get().currentUser?.level}.`
                    });
                }

                addNotification({
                    type: 'achievement',
                    title: '¡Especie Registrada!',
                    message: `Has encontrado un ${catalogBird.name}. Recibes +1 Pluma y +50 XP.`
                });
            },

            purchaseItem: (price: number) => {
                const state = get();
                if (state.currentUser && state.currentUser.feathers >= price) {
                    set((s) => ({
                        currentUser: s.currentUser ? { ...s.currentUser, feathers: s.currentUser.feathers - price } : null
                    }));
                    state.addNotification({
                        type: 'system',
                        title: 'Compra Realizada',
                        message: `Has adquirido un objeto por ${price} plumas.`
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
                    state.addNotification({
                        type: 'system',
                        title: 'Venta Realizada',
                        message: `Has vendido un objeto por ${price} plumas.`,
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
                guildChats: state.guildChats,
                posts: state.posts
            })
        }
    )
);
