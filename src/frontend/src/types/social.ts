/**
 * AVIS — Tipos sociales (Bandadas, Chat, Eventos)
 */
import { BirdCard, BiomeType } from './types';

// ─── BANDADA (FLOCK) ───────────────────────────────────────
export type FlockMemberRole = 'LEADER' | 'OFFICER' | 'MEMBER';

export interface FlockMember {
    playerId: string;
    name: string;
    avatar: string;
    role: FlockMemberRole;
    reputation: number;
    lastActive: string;
    isOnline: boolean;
}

export interface Flock {
    id: string;
    name: string;
    emblem: string;
    members: FlockMember[];
    maxMembers: number;
    level: number;
    experience: number;
    activeEvents: CommunityEvent[];
}

// ─── CHAT ──────────────────────────────────────────────────
export type ChatMessageType = 'TEXT' | 'STICKER' | 'CARD_SHARE' | 'TIP';

export interface ChatMessage {
    id: string;
    senderId: string;
    senderName: string;
    senderAvatar: string;
    content: string;
    timestamp: string;
    type: ChatMessageType;
    sharedCard?: BirdCard;
    tip?: StrategicTip;
}

export interface StrategicTip {
    message: string;
    suggestedAction: 'EXPLORE_BIOME' | 'CRAFT_ITEM' | 'BATTLE';
    targetBiome?: BiomeType;
}

// ─── EVENTOS COMUNITARIOS ──────────────────────────────────
export type EventType = 'COLLECTION_RACE' | 'BOSS_BATTLE' | 'EXPEDITION_MARATHON';

export interface CommunityEvent {
    id: string;
    name: string;
    description: string;
    type: EventType;
    startDate: string;
    endDate: string;
    progress: number;
    rewards: EventReward[];
    isActive: boolean;
}

export interface EventReward {
    type: 'SEEDS' | 'MATERIALS' | 'RARE_CARD' | 'REPUTATION';
    quantity: number;
    description: string;
}

// ─── ESTADO DE BANDADA ─────────────────────────────────────
export type FlockTab = 'CHAT' | 'MEMBERS' | 'EVENTS';

export interface FlockState {
    flock: Flock | null;
    messages: ChatMessage[];
    activeTab: FlockTab;
    isSearching: boolean;
    searchResults: Flock[];
}
