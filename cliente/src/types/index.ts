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
