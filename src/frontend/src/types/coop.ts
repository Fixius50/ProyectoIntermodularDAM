/**
 * AVIS — Tipos de Socialización Cooperativa
 * Entrenamiento, expediciones cooperativas, invitaciones.
 */
import { BirdCard, BiomeType } from './types';

// ─── INVITACIONES ──────────────────────────────────────────
export type InvitationType = 'COOP_EXPEDITION' | 'TRAINING' | 'TRADE_REQUEST' | 'FLOCK_INVITE';
export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED';

export interface Invitation {
    id: string;
    type: InvitationType;
    fromPlayerId: string;
    fromPlayerName: string;
    fromPlayerAvatar: string;
    message: string;
    timestamp: string;
    status: InvitationStatus;
    data?: {
        biome?: BiomeType;
        birdId?: string;
    };
}

// ─── ENTRENAMIENTO COOPERATIVO ─────────────────────────────
export type TrainingType = 'ATTACK_BOOST' | 'DEFENSE_BOOST' | 'POSTURE_UNLOCK';

export interface TrainingSession {
    id: string;
    participantIds: string[];
    participantNames: string[];
    birdCard: BirdCard;
    trainingType: TrainingType;
    progress: number; // 0-100
    startedAt: string;
    completesAt: string;
    isComplete: boolean;
}

// ─── EXPEDICIÓN COOPERATIVA ────────────────────────────────
export interface CoopExpedition {
    id: string;
    biome: BiomeType;
    participants: {
        playerId: string;
        playerName: string;
        playerAvatar: string;
        birdCard: BirdCard;
    }[];
    maxParticipants: number;
    status: 'WAITING' | 'IN_PROGRESS' | 'COMPLETED';
    bonusMultiplier: number;
    createdAt: string;
    rewards?: { type: string; quantity: number }[];
}

// ─── ESTADO COOPERATIVO ────────────────────────────────────
export type CoopTab = 'INVITATIONS' | 'TRAINING' | 'EXPEDITIONS';

export interface CoopState {
    invitations: Invitation[];
    trainingSessions: TrainingSession[];
    coopExpeditions: CoopExpedition[];
    activeTab: CoopTab;
}
