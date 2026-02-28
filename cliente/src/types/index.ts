export interface WeatherData {
    temp: number;
    condition: string;
    icon: string;
    location: string;
    description: string;
}

export type TimePhase = 'Morning' | 'Afternoon' | 'Night';

export interface TimeData {
    phase: TimePhase;
    hour: number;
    icon: string;
}

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
    scientificName?: string;
    fact?: string;
    audioUrl?: string;
    origin?: string;
    isStudied?: boolean;
    preferredPhase?: Array<'Morning' | 'Afternoon' | 'Night'>;
    preferredWeather?: string[];
    status: 'Santuario' | 'Expedicion' | 'Certamen';
}

export interface CatalogBird extends Bird {
    scientificName: string;
    fact: string;
    preferredPhase: Array<'Morning' | 'Afternoon' | 'Night'>;
    preferredWeather?: string[];
    rarity: 'common' | 'uncommon' | 'rare';
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
    favoriteBirdId?: string;
    tailscaleUser?: string;
    tailscalePass?: string;
}

export interface Activity {
    id: string;
    action: string;
    time: number;
    icon: string;
}

export interface GuildMember {
    id: string;
    name: string;
    avatar: string;
    role: string;
    contributions: number;
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
    memberList?: GuildMember[];
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
    birdId?: string; // For bird sighting cards
    likes: number; // Keep for legacy but we'll use reactions
    reactions?: Record<string, number>; // { '🐦': 5, '🪶': 2 }
    comments: number;
    commentList?: ChatMessage[];
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
    language: 'es' | 'en';
    posts: SocialPost[];
    guildChats: Record<string, ChatMessage[]>;
    availableGuilds: Guild[];
    battleLogs: string[];
    birds: Bird[];
    categories: string[];
    theme: 'light' | 'dark';
    activityHistory: Activity[];
}
