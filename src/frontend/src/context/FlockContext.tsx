/**
 * AVIS — FlockContext
 * Gestiona el estado de la Bandada: miembros, chat, eventos.
 * Modo mock para desarrollo sin backend.
 */
import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import {
    Flock,
    FlockMember,
    FlockState,
    FlockTab,
    ChatMessage,
    CommunityEvent,
} from '../types/social';

// ─── ACCIONES ──────────────────────────────────────────────
type FlockAction =
    | { type: 'SET_FLOCK'; payload: Flock }
    | { type: 'LEAVE_FLOCK' }
    | { type: 'SET_TAB'; payload: FlockTab }
    | { type: 'ADD_MESSAGE'; payload: ChatMessage }
    | { type: 'SET_MESSAGES'; payload: ChatMessage[] }
    | { type: 'UPDATE_EVENT_PROGRESS'; payload: { eventId: string; progress: number } }
    | { type: 'SET_SEARCHING'; payload: boolean }
    | { type: 'SET_SEARCH_RESULTS'; payload: Flock[] };

// ─── DATOS MOCK ────────────────────────────────────────────
const mockMembers: FlockMember[] = [
    { playerId: 'user-1', name: 'Naturalista', avatar: '🧑‍🔬', role: 'LEADER', reputation: 250, lastActive: new Date().toISOString(), isOnline: true },
    { playerId: 'user-2', name: 'Ornitóloga', avatar: '👩‍🔬', role: 'OFFICER', reputation: 180, lastActive: new Date().toISOString(), isOnline: true },
    { playerId: 'user-3', name: 'Explorador', avatar: '🧭', role: 'MEMBER', reputation: 120, lastActive: new Date(Date.now() - 3600000).toISOString(), isOnline: false },
    { playerId: 'user-4', name: 'Guardabosques', avatar: '🌲', role: 'MEMBER', reputation: 95, lastActive: new Date(Date.now() - 7200000).toISOString(), isOnline: false },
    { playerId: 'user-5', name: 'Coleccionista', avatar: '📖', role: 'MEMBER', reputation: 210, lastActive: new Date().toISOString(), isOnline: true },
];

const mockEvents: CommunityEvent[] = [
    {
        id: 'evt-1',
        name: 'Carrera de Colección: Aves Acuáticas',
        description: '¡Captura 50 aves de hábitat Agua entre toda la bandada!',
        type: 'COLLECTION_RACE',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 86400000 * 3).toISOString(),
        progress: 34,
        rewards: [
            { type: 'SEEDS', quantity: 500, description: '500 semillas para cada miembro' },
            { type: 'RARE_CARD', quantity: 1, description: 'Carta rara: Martín Pescador' },
        ],
        isActive: true,
    },
];

const mockMessages: ChatMessage[] = [
    { id: 'msg-1', senderId: 'user-2', senderName: 'Ornitóloga', senderAvatar: '👩‍🔬', content: '¡He visto un águila real en Montaña! 🦅', timestamp: new Date(Date.now() - 600000).toISOString(), type: 'TEXT' },
    { id: 'msg-2', senderId: 'user-5', senderName: 'Coleccionista', senderAvatar: '📖', content: '¡Genial! Yo necesito esa carta para completar el álbum.', timestamp: new Date(Date.now() - 300000).toISOString(), type: 'TEXT' },
    { id: 'msg-3', senderId: 'user-1', senderName: 'Naturalista', senderAvatar: '🧑‍🔬', content: 'Probad con cebo PEZ en Costa, hay aves raras.', timestamp: new Date(Date.now() - 120000).toISOString(), type: 'TIP', tip: { message: 'Probad con cebo PEZ en Costa', suggestedAction: 'EXPLORE_BIOME', targetBiome: 'COSTA' } },
];

const mockFlock: Flock = {
    id: 'flock-1',
    name: 'Los Observadores',
    emblem: '🦉',
    members: mockMembers,
    maxMembers: 30,
    level: 3,
    experience: 720,
    activeEvents: mockEvents,
};

const mockSearchResults: Flock[] = [
    { id: 'flock-2', name: 'Aves del Sur', emblem: '🐧', members: [], maxMembers: 20, level: 2, experience: 400, activeEvents: [] },
    { id: 'flock-3', name: 'Guacamayos', emblem: '🦜', members: [], maxMembers: 15, level: 5, experience: 1200, activeEvents: [] },
    { id: 'flock-4', name: 'Águilas Doradas', emblem: '🦅', members: [], maxMembers: 25, level: 4, experience: 950, activeEvents: [] },
];

// ─── ESTADO INICIAL ────────────────────────────────────────
const initialState: FlockState = {
    flock: mockFlock,
    messages: mockMessages,
    activeTab: 'CHAT',
    isSearching: false,
    searchResults: [],
};

// ─── REDUCER ───────────────────────────────────────────────
function flockReducer(state: FlockState, action: FlockAction): FlockState {
    switch (action.type) {
        case 'SET_FLOCK':
            return { ...state, flock: action.payload };

        case 'LEAVE_FLOCK':
            return { ...state, flock: null, messages: [] };

        case 'SET_TAB':
            return { ...state, activeTab: action.payload };

        case 'ADD_MESSAGE':
            return { ...state, messages: [...state.messages, action.payload] };

        case 'SET_MESSAGES':
            return { ...state, messages: action.payload };

        case 'UPDATE_EVENT_PROGRESS':
            if (!state.flock) return state;
            return {
                ...state,
                flock: {
                    ...state.flock,
                    activeEvents: state.flock.activeEvents.map((e) =>
                        e.id === action.payload.eventId
                            ? { ...e, progress: action.payload.progress }
                            : e
                    ),
                },
            };

        case 'SET_SEARCHING':
            return { ...state, isSearching: action.payload };

        case 'SET_SEARCH_RESULTS':
            return { ...state, searchResults: action.payload };

        default:
            return state;
    }
}

// ─── CONTEXT ───────────────────────────────────────────────
interface FlockContextType {
    state: FlockState;
    setTab: (tab: FlockTab) => void;
    sendMessage: (content: string) => void;
    leaveFlock: () => void;
    searchFlocks: (query: string) => void;
    joinFlock: (flockId: string) => void;
}

const FlockContext = createContext<FlockContextType | undefined>(undefined);

// ─── PROVIDER ──────────────────────────────────────────────
export function FlockProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(flockReducer, initialState);

    const setTab = useCallback((tab: FlockTab) => {
        dispatch({ type: 'SET_TAB', payload: tab });
    }, []);

    const sendMessage = useCallback((content: string) => {
        if (!content.trim()) return;
        const msg: ChatMessage = {
            id: `msg-${Date.now()}`,
            senderId: 'user-1',
            senderName: 'Naturalista',
            senderAvatar: '🧑‍🔬',
            content: content.trim(),
            timestamp: new Date().toISOString(),
            type: 'TEXT',
        };
        dispatch({ type: 'ADD_MESSAGE', payload: msg });

        // Simular respuesta automática del "bot" de la bandada
        setTimeout(() => {
            const botResponses = [
                '¡Buena observación! 🐦',
                'Interesante, ¿en qué bioma?',
                '¡Sigue así! 💪',
                'Yo vi algo parecido ayer en Bosque.',
                '¿Alguien quiere hacer una expedición juntos? 🔭',
            ];
            const botMsg: ChatMessage = {
                id: `msg-${Date.now() + 1}`,
                senderId: 'user-2',
                senderName: 'Ornitóloga',
                senderAvatar: '👩‍🔬',
                content: botResponses[Math.floor(Math.random() * botResponses.length)],
                timestamp: new Date().toISOString(),
                type: 'TEXT',
            };
            dispatch({ type: 'ADD_MESSAGE', payload: botMsg });
        }, 1500);
    }, []);

    const leaveFlock = useCallback(() => {
        dispatch({ type: 'LEAVE_FLOCK' });
    }, []);

    const searchFlocks = useCallback((query: string) => {
        dispatch({ type: 'SET_SEARCHING', payload: true });
        // Simular búsqueda
        setTimeout(() => {
            const results = mockSearchResults.filter((f) =>
                f.name.toLowerCase().includes(query.toLowerCase())
            );
            dispatch({ type: 'SET_SEARCH_RESULTS', payload: results.length > 0 ? results : mockSearchResults });
            dispatch({ type: 'SET_SEARCHING', payload: false });
        }, 600);
    }, []);

    const joinFlock = useCallback((flockId: string) => {
        const found = mockSearchResults.find((f) => f.id === flockId);
        if (found) {
            const joinedFlock: Flock = {
                ...found,
                members: [
                    { playerId: 'user-1', name: 'Naturalista', avatar: '🧑‍🔬', role: 'MEMBER', reputation: 0, lastActive: new Date().toISOString(), isOnline: true },
                ],
            };
            dispatch({ type: 'SET_FLOCK', payload: joinedFlock });
        }
    }, []);

    return (
        <FlockContext.Provider value={{ state, setTab, sendMessage, leaveFlock, searchFlocks, joinFlock }}>
            {children}
        </FlockContext.Provider>
    );
}

// ─── HOOK ──────────────────────────────────────────────────
export function useFlock(): FlockContextType {
    const context = useContext(FlockContext);
    if (!context) {
        throw new Error('useFlock debe usarse dentro de <FlockProvider>');
    }
    return context;
}
