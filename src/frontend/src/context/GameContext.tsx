import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import {
    Weather,
    Player,
    GamePhase,
    ExpeditionState,
    BirdCard,
    Material,
    CraftItem,
} from '../types/types';

// ─── ESTADO DEL JUEGO ──────────────────────────────────────
export interface GameState {
    weather: Weather;
    player: Player;
    gamePhase: GamePhase;
    expedition: ExpeditionState;
}

// ─── ACCIONES ──────────────────────────────────────────────
type GameAction =
    | { type: 'SET_WEATHER'; payload: Weather }
    | { type: 'SET_GAME_PHASE'; payload: GamePhase }
    | { type: 'UPDATE_SEEDS'; payload: number }
    | { type: 'UPDATE_FIELD_NOTES'; payload: number }
    | { type: 'ADD_CARD'; payload: BirdCard }
    | { type: 'ADD_MATERIAL'; payload: { type: Material['type']; quantity: number } }
    | { type: 'ADD_CRAFT_ITEM'; payload: CraftItem }
    | { type: 'REMOVE_CRAFT_ITEM'; payload: string }
    | { type: 'START_EXPEDITION'; payload: { biome: ExpeditionState['selectedBiome']; bait: ExpeditionState['selectedBait'] } }
    | { type: 'COMPLETE_EXPEDITION' }
    | { type: 'RESET_EXPEDITION' };

// ─── DATOS MOCK ────────────────────────────────────────────
const mockBirds: BirdCard[] = [
    {
        id: 'bird-1',
        name: 'Gorrión Común',
        photo: 'https://images.unsplash.com/photo-1551085254-e96b210db32e?q=80&w=1000',
        cost: 1,
        preferredPosture: 'CANTO',
        passiveAbility: 'Si hace sol, gana +1 en Ataque',
        stats: { attack: 3, defense: 4, speed: 5 },
        level: 5,
        xp: 120,
        xpToNextLevel: 500,
        scientificName: 'Passer domesticus',
        habitat: 'BOSQUE',
        curiosity: 'Es una de las aves más comunes del mundo y se ha adaptado perfectamente a la vida urbana.',
    },
    {
        id: 'bird-2',
        name: 'Martín Pescador',
        photo: 'https://images.unsplash.com/photo-1470114755716-696615b671a5?q=80&w=1000',
        cost: 3,
        preferredPosture: 'VUELO',
        passiveAbility: 'Si llueve, gana +2 en Velocidad',
        stats: { attack: 6, defense: 3, speed: 8 },
        level: 3,
        xp: 450,
        xpToNextLevel: 1000,
        scientificName: 'Alcedo atthis',
        habitat: 'AGUA',
        curiosity: 'Puede zambullirse a velocidades de hasta 40 km/h para atrapar peces.',
    },
    {
        id: 'bird-3',
        name: 'Águila Real',
        photo: 'https://images.unsplash.com/photo-1611771341253-dad2397127b8?q=80&w=1000',
        cost: 5,
        preferredPosture: 'VUELO',
        passiveAbility: 'Si hay viento, gana +2 en Vuelo',
        stats: { attack: 9, defense: 7, speed: 8 },
        level: 10,
        xp: 2500,
        xpToNextLevel: 5000,
        scientificName: 'Aquila chrysaetos',
        habitat: 'MONTAÑA',
        curiosity: 'Tiene una envergadura de más de 2 metros y puede divisar presas a más de 3 km.',
    },
    {
        id: 'bird-4',
        name: 'Petirrojo',
        photo: 'https://images.unsplash.com/photo-1518992028580-6d57bd80f2dd?q=80&w=1000',
        cost: 2,
        preferredPosture: 'CANTO',
        passiveAbility: 'Si es de noche, gana +1 en Defensa',
        stats: { attack: 4, defense: 5, speed: 4 },
        level: 2,
        xp: 150,
        xpToNextLevel: 300,
        scientificName: 'Erithacus rubecula',
        habitat: 'BOSQUE',
        curiosity: 'Es conocido por su canto melodioso y es una de las pocas aves que canta durante el invierno.',
    },
    {
        id: 'bird-5',
        name: 'Gaviota Patiamarilla',
        photo: 'https://images.unsplash.com/photo-1511910849309-0d5b2c18aca8?q=80&w=1000',
        cost: 2,
        preferredPosture: 'PLUMAJE',
        passiveAbility: 'Si llueve, gana +1 en Defensa',
        stats: { attack: 5, defense: 6, speed: 4 },
        level: 4,
        xp: 300,
        xpToNextLevel: 800,
        scientificName: 'Larus michahellis',
        habitat: 'AGUA',
        curiosity: 'Es un ave oportunista que se ha adaptado a alimentarse de residuos humanos.',
    },
    {
        id: 'bird-6',
        name: 'Mirlo Común',
        photo: 'https://images.unsplash.com/photo-1521663049156-427963d7eaba?q=80&w=1000',
        cost: 2,
        preferredPosture: 'CANTO',
        passiveAbility: 'Si está nublado, gana +2 en Canto',
        stats: { attack: 5, defense: 4, speed: 6 },
        level: 1,
        xp: 20,
        xpToNextLevel: 100,
        scientificName: 'Turdus merula',
        habitat: 'BOSQUE',
        curiosity: 'El macho es negro con el pico amarillo, mientras que la hembra es de color marrón.',
    },
];



const initialState: GameState = {
    weather: {
        condition: 'SOL',
        location: 'Madrid',
        temperature: 18,
    },
    player: {
        name: 'Naturalista',
        reputation: 0,
        resources: {
            seeds: 150,
            fieldNotes: 3,
        },
        materials: [
            { type: 'MADERA', quantity: 5, icon: '🪵', label: 'Madera' },
            { type: 'METAL', quantity: 2, icon: '⚙️', label: 'Metal' },
            { type: 'FIBRAS', quantity: 8, icon: '🌿', label: 'Fibras' },
            { type: 'CEBO_SEMILLAS', quantity: 10, icon: '🌰', label: 'Semillas' },
            { type: 'CEBO_FRUTA', quantity: 4, icon: '🍎', label: 'Fruta' },
            { type: 'CEBO_INSECTOS', quantity: 6, icon: '🪱', label: 'Insectos' },
        ],
        craftItems: [
            { id: 'item-1', type: 'FOTO', icon: '📸', label: 'Foto de Gorrión' },
            { id: 'item-2', type: 'PLUMA', icon: '🪶', label: 'Pluma dorada' },
            { id: 'item-3', type: 'NOTAS', icon: '📝', label: 'Notas de Campo' },
            { id: 'item-4', type: 'FOTO', icon: '📸', label: 'Foto de Águila' },
        ],
        collection: mockBirds,
    },
    gamePhase: 'MAÑANA',
    expedition: {
        status: 'IDLE',
        selectedBiome: null,
        selectedBait: null,
        timeRemaining: 0,
    },
};

// ─── REDUCER ───────────────────────────────────────────────
function gameReducer(state: GameState, action: GameAction): GameState {
    switch (action.type) {
        case 'SET_WEATHER':
            return { ...state, weather: action.payload };

        case 'SET_GAME_PHASE':
            return { ...state, gamePhase: action.payload };

        case 'UPDATE_SEEDS':
            return {
                ...state,
                player: {
                    ...state.player,
                    resources: {
                        ...state.player.resources,
                        seeds: state.player.resources.seeds + action.payload,
                    },
                },
            };

        case 'UPDATE_FIELD_NOTES':
            return {
                ...state,
                player: {
                    ...state.player,
                    resources: {
                        ...state.player.resources,
                        fieldNotes: state.player.resources.fieldNotes + action.payload,
                    },
                },
            };

        case 'ADD_CARD':
            return {
                ...state,
                player: {
                    ...state.player,
                    collection: [...state.player.collection, action.payload],
                },
            };

        case 'ADD_MATERIAL': {
            const materials = state.player.materials.map((m) =>
                m.type === action.payload.type
                    ? { ...m, quantity: m.quantity + action.payload.quantity }
                    : m
            );
            return { ...state, player: { ...state.player, materials } };
        }

        case 'ADD_CRAFT_ITEM':
            return {
                ...state,
                player: {
                    ...state.player,
                    craftItems: [...state.player.craftItems, action.payload],
                },
            };

        case 'REMOVE_CRAFT_ITEM':
            return {
                ...state,
                player: {
                    ...state.player,
                    craftItems: state.player.craftItems.filter((i) => i.id !== action.payload),
                },
            };

        case 'START_EXPEDITION':
            return {
                ...state,
                expedition: {
                    status: 'IN_PROGRESS',
                    selectedBiome: action.payload.biome,
                    selectedBait: action.payload.bait,
                    timeRemaining: 120, // 2 minutos para demo
                },
            };

        case 'COMPLETE_EXPEDITION':
            return {
                ...state,
                expedition: { ...state.expedition, status: 'COMPLETED' },
            };

        case 'RESET_EXPEDITION':
            return {
                ...state,
                expedition: { status: 'IDLE', selectedBiome: null, selectedBait: null, timeRemaining: 0 },
            };

        default:
            return state;
    }
}

// ─── CONTEXT ───────────────────────────────────────────────
interface GameContextType {
    state: GameState;
    dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(gameReducer, initialState);
    return (
        <GameContext.Provider value={{ state, dispatch }}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame(): GameContextType {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame debe usarse dentro de un GameProvider');
    }
    return context;
}
