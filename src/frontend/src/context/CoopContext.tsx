/**
 * AVIS — CoopContext
 * Gestiona invitaciones, entrenamientos cooperativos y expediciones cooperativas.
 * Modo mock para desarrollo.
 */
import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import {
    CoopState,
    CoopTab,
    Invitation,
    InvitationStatus,
    TrainingSession,
    CoopExpedition,
} from '../types/coop';

// ─── ACCIONES ──────────────────────────────────────────────
type CoopAction =
    | { type: 'SET_TAB'; payload: CoopTab }
    | { type: 'RESPOND_INVITATION'; payload: { id: string; status: InvitationStatus } }
    | { type: 'START_TRAINING'; payload: TrainingSession }
    | { type: 'UPDATE_TRAINING_PROGRESS'; payload: { id: string; progress: number } }
    | { type: 'COMPLETE_TRAINING'; payload: string }
    | { type: 'CREATE_COOP_EXPEDITION'; payload: CoopExpedition }
    | { type: 'START_COOP_EXPEDITION'; payload: string }
    | { type: 'COMPLETE_COOP_EXPEDITION'; payload: string };

// ─── DATOS MOCK ────────────────────────────────────────────
const mockInvitations: Invitation[] = [
    {
        id: 'inv-1', type: 'COOP_EXPEDITION', fromPlayerId: 'user-2', fromPlayerName: 'Ornitóloga', fromPlayerAvatar: '👩‍🔬',
        message: '¿Vienes a explorar Costa conmigo? ¡Hay aves raras!', timestamp: new Date(Date.now() - 300000).toISOString(),
        status: 'PENDING', data: { biome: 'COSTA' },
    },
    {
        id: 'inv-2', type: 'TRAINING', fromPlayerId: 'user-5', fromPlayerName: 'Coleccionista', fromPlayerAvatar: '📖',
        message: 'Entrenemos mi Cóndor para que aprenda una nueva postura.', timestamp: new Date(Date.now() - 600000).toISOString(),
        status: 'PENDING',
    },
    {
        id: 'inv-3', type: 'FLOCK_INVITE', fromPlayerId: 'user-3', fromPlayerName: 'Explorador', fromPlayerAvatar: '🧭',
        message: '¡Únete a nuestra bandada "Águilas del Norte"!', timestamp: new Date(Date.now() - 1200000).toISOString(),
        status: 'PENDING',
    },
];

const mockTraining: TrainingSession[] = [
    {
        id: 'train-1',
        participantIds: ['user-1', 'user-5'],
        participantNames: ['Naturalista', 'Coleccionista'],
        birdCard: { id: 'bc-1', name: 'Petirrojo', photo: '🐦', rarity: 'COMMON', attack: 3, defense: 4, postures: ['IDLE', 'ALERT'], scientificName: 'Erithacus rubecula', habitat: 'Bosque', curiosity: 'Canta de noche' } as any,
        trainingType: 'ATTACK_BOOST',
        progress: 65,
        startedAt: new Date(Date.now() - 7200000).toISOString(),
        completesAt: new Date(Date.now() + 3600000).toISOString(),
        isComplete: false,
    },
];

const mockCoopExpeditions: CoopExpedition[] = [
    {
        id: 'coop-1', biome: 'MONTAÑA', maxParticipants: 3, status: 'WAITING', bonusMultiplier: 1.5,
        createdAt: new Date(Date.now() - 600000).toISOString(),
        participants: [
            { playerId: 'user-2', playerName: 'Ornitóloga', playerAvatar: '👩‍🔬', birdCard: { id: 'bc-3', name: 'Águila Real', photo: '🦅', rarity: 'RARE', attack: 8, defense: 6 } as any },
        ],
    },
    {
        id: 'coop-2', biome: 'COSTA', maxParticipants: 4, status: 'WAITING', bonusMultiplier: 2.0,
        createdAt: new Date(Date.now() - 300000).toISOString(),
        participants: [
            { playerId: 'user-3', playerName: 'Explorador', playerAvatar: '🧭', birdCard: { id: 'bc-5', name: 'Gaviota', photo: '🕊️', rarity: 'COMMON', attack: 4, defense: 3 } as any },
            { playerId: 'user-4', playerName: 'Guardabosques', playerAvatar: '🌲', birdCard: { id: 'bc-6', name: 'Pelícano', photo: '🦆', rarity: 'UNCOMMON', attack: 5, defense: 6 } as any },
        ],
    },
];

// ─── ESTADO INICIAL ────────────────────────────────────────
const initialState: CoopState = {
    invitations: mockInvitations,
    trainingSessions: mockTraining,
    coopExpeditions: mockCoopExpeditions,
    activeTab: 'INVITATIONS',
};

// ─── REDUCER ───────────────────────────────────────────────
function coopReducer(state: CoopState, action: CoopAction): CoopState {
    switch (action.type) {
        case 'SET_TAB':
            return { ...state, activeTab: action.payload };

        case 'RESPOND_INVITATION':
            return {
                ...state,
                invitations: state.invitations.map((inv) =>
                    inv.id === action.payload.id ? { ...inv, status: action.payload.status } : inv
                ),
            };

        case 'START_TRAINING':
            return {
                ...state,
                trainingSessions: [...state.trainingSessions, action.payload],
            };

        case 'UPDATE_TRAINING_PROGRESS':
            return {
                ...state,
                trainingSessions: state.trainingSessions.map((s) =>
                    s.id === action.payload.id ? { ...s, progress: action.payload.progress } : s
                ),
            };

        case 'COMPLETE_TRAINING':
            return {
                ...state,
                trainingSessions: state.trainingSessions.map((s) =>
                    s.id === action.payload ? { ...s, isComplete: true, progress: 100 } : s
                ),
            };

        case 'CREATE_COOP_EXPEDITION':
            return {
                ...state,
                coopExpeditions: [...state.coopExpeditions, action.payload],
            };

        case 'START_COOP_EXPEDITION':
            return {
                ...state,
                coopExpeditions: state.coopExpeditions.map((e) =>
                    e.id === action.payload ? { ...e, status: 'IN_PROGRESS' as const } : e
                ),
            };

        case 'COMPLETE_COOP_EXPEDITION':
            return {
                ...state,
                coopExpeditions: state.coopExpeditions.map((e) =>
                    e.id === action.payload
                        ? { ...e, status: 'COMPLETED' as const, rewards: [{ type: 'SEEDS', quantity: 200 }, { type: 'RARE_CARD', quantity: 1 }] }
                        : e
                ),
            };

        default:
            return state;
    }
}

// ─── CONTEXT ───────────────────────────────────────────────
interface CoopContextType {
    state: CoopState;
    setTab: (tab: CoopTab) => void;
    acceptInvitation: (id: string) => void;
    declineInvitation: (id: string) => void;
    joinCoopExpedition: (expeditionId: string) => void;
    startCoopExpedition: (expeditionId: string) => void;
    boostTraining: (trainingId: string) => void;
}

const CoopContext = createContext<CoopContextType | undefined>(undefined);

// ─── PROVIDER ──────────────────────────────────────────────
export function CoopProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(coopReducer, initialState);

    const setTab = useCallback((tab: CoopTab) => {
        dispatch({ type: 'SET_TAB', payload: tab });
    }, []);

    const acceptInvitation = useCallback((id: string) => {
        dispatch({ type: 'RESPOND_INVITATION', payload: { id, status: 'ACCEPTED' } });
    }, []);

    const declineInvitation = useCallback((id: string) => {
        dispatch({ type: 'RESPOND_INVITATION', payload: { id, status: 'DECLINED' } });
    }, []);

    const joinCoopExpedition = useCallback((expeditionId: string) => {
        const exp = state.coopExpeditions.find((e) => e.id === expeditionId);
        if (!exp || exp.participants.length >= exp.maxParticipants) return;
        // Simularly add player to expedition
        const updated: CoopExpedition = {
            ...exp,
            participants: [
                ...exp.participants,
                { playerId: 'user-1', playerName: 'Naturalista', playerAvatar: '🧑‍🔬', birdCard: { id: 'bc-1', name: 'Petirrojo', photo: '🐦' } as any },
            ],
        };
        dispatch({ type: 'CREATE_COOP_EXPEDITION', payload: updated });
    }, [state.coopExpeditions]);

    const startCoopExpedition = useCallback((expeditionId: string) => {
        dispatch({ type: 'START_COOP_EXPEDITION', payload: expeditionId });
        // Simular completar tras 3 segundos
        setTimeout(() => {
            dispatch({ type: 'COMPLETE_COOP_EXPEDITION', payload: expeditionId });
        }, 3000);
    }, []);

    const boostTraining = useCallback((trainingId: string) => {
        const session = state.trainingSessions.find((s) => s.id === trainingId);
        if (!session || session.isComplete) return;

        const newProgress = Math.min(100, session.progress + 15);
        dispatch({ type: 'UPDATE_TRAINING_PROGRESS', payload: { id: trainingId, progress: newProgress } });

        if (newProgress >= 100) {
            dispatch({ type: 'COMPLETE_TRAINING', payload: trainingId });
        }
    }, [state.trainingSessions]);

    return (
        <CoopContext.Provider value={{
            state, setTab, acceptInvitation, declineInvitation,
            joinCoopExpedition, startCoopExpedition, boostTraining,
        }}>
            {children}
        </CoopContext.Provider>
    );
}

// ─── HOOK ──────────────────────────────────────────────────
export function useCoop(): CoopContextType {
    const context = useContext(CoopContext);
    if (!context) {
        throw new Error('useCoop debe usarse dentro de <CoopProvider>');
    }
    return context;
}
