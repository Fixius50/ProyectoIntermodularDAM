/**
 * AVIS — Tipos de datos del modelo de juego
 */

// ─── CLIMA ─────────────────────────────────────────────────
export type WeatherCondition = 'SOL' | 'LLUVIA' | 'VIENTO' | 'NOCHE' | 'NUBLADO';

export interface Weather {
    condition: WeatherCondition;
    location: string;
    temperature: number; // ºC
}

// ─── MATERIALES ────────────────────────────────────────────
export type MaterialType = 'MADERA' | 'METAL' | 'FIBRAS' | 'CEBO_SEMILLAS' | 'CEBO_FRUTA' | 'CEBO_INSECTOS';
export type CraftItemType = 'FOTO' | 'PLUMA' | 'NOTAS';

export interface Material {
    type: MaterialType;
    quantity: number;
    icon: string; // Emoji
    label: string;
}

export interface CraftItem {
    id: string;
    type: CraftItemType;
    icon: string;
    label: string;
}

// ─── BIOMAS ────────────────────────────────────────────────
export type BiomeType = 'BOSQUE' | 'COSTA' | 'MONTAÑA';

export interface Biome {
    type: BiomeType;
    icon: string;
    label: string;
    color: string;
}

// ─── CEBOS ─────────────────────────────────────────────────
export type BaitType = 'GUSANO' | 'FRUTA' | 'PEZ';

export interface Bait {
    type: BaitType;
    icon: string;
    label: string;
}

// ─── POSTURAS (CERTAMEN) ───────────────────────────────────
export type PostureType = 'CANTO' | 'PLUMAJE' | 'VUELO';

export interface Posture {
    type: PostureType;
    icon: string;
    label: string;
    color: string;
    beatsLabel: string;  // e.g. "Fuerte contra Plumaje"
    beats: PostureType;  // La postura a la que vence
}

// ─── CARTA DE AVE ──────────────────────────────────────────
export type HabitatFilter = 'TODOS' | 'AGUA' | 'BOSQUE' | 'MONTAÑA';

export interface BirdCard {
    id: string;
    // Cara A (Juego)
    name: string;          // Nombre común
    photo: string;         // URL de la imagen
    cost: number;          // Coste en semillas (mana)
    preferredPosture: PostureType;
    passiveAbility: string; // Texto de la habilidad pasiva
    stats: {
        attack: number;  // 1-10
        defense: number; // 1-10
        speed: number;   // 1-10
    };

    // Cara B (Educativa)
    scientificName: string;
    habitat: HabitatFilter;
    curiosity: string;     // Texto de curiosidad
    songUrl?: string;      // Audio del canto (Nuthatch API)
}

// ─── JUGADOR ───────────────────────────────────────────────
export interface Player {
    name: string;
    reputation: number;
    resources: {
        seeds: number;      // Semillas (moneda principal / mana)
        fieldNotes: number; // Notas de Campo (del minijuego Enfoque)
    };
    materials: Material[];
    craftItems: CraftItem[];
    collection: BirdCard[];
}

// ─── FASE DEL DÍA ──────────────────────────────────────────
export type GamePhase = 'MAÑANA' | 'MEDIODÍA' | 'TARDE' | 'NOCHE';

// ─── EXPEDICIÓN ────────────────────────────────────────────
export type ExpeditionStatus = 'IDLE' | 'IN_PROGRESS' | 'COMPLETED';

export interface ExpeditionState {
    status: ExpeditionStatus;
    selectedBiome: BiomeType | null;
    selectedBait: BaitType | null;
    timeRemaining: number; // en segundos
}

// ─── BATALLA (CERTAMEN) ────────────────────────────────────
export type BattlePhase = 'SETUP' | 'PLAYING' | 'RESOLVED';
export type DuelResult = 'WIN' | 'LOSE' | 'DRAW';

export interface BattleSlotState {
    card: BirdCard | null;
    isTired: boolean; // Tras un empate
}

export interface BattleState {
    phase: BattlePhase;
    turn: number;
    mana: number; // = turn (progresivo)
    playerSlots: [BattleSlotState, BattleSlotState, BattleSlotState];
    rivalSlots: [BattleSlotState, BattleSlotState, BattleSlotState];
    playerReputation: number;
    rivalReputation: number;
}
