/**
 * AVIS — Tipos del Mercado (Marketplace)
 * Intercambio de cartas y recursos entre jugadores.
 */
import { BirdCard, Material } from './types';

// ─── LISTADO DE INTERCAMBIO ────────────────────────────────
export type ListingStatus = 'ACTIVE' | 'SOLD' | 'EXPIRED' | 'CANCELLED';
export type ListingType = 'CARD' | 'MATERIAL' | 'RESOURCE';

export interface TradeOffer {
    type: ListingType;
    card?: BirdCard;
    material?: Material;
    resourceType?: 'seeds' | 'fieldNotes';
    quantity?: number;
}

export interface MarketListing {
    id: string;
    sellerId: string;
    sellerName: string;
    sellerAvatar: string;
    offer: TradeOffer;
    price: number;
    currency: 'seeds' | 'fieldNotes';
    status: ListingStatus;
    createdAt: string;
    expiresAt: string;
    featured: boolean;
}

// ─── TRANSACCIÓN ───────────────────────────────────────────
export interface Transaction {
    id: string;
    listingId: string;
    buyerId: string;
    buyerName: string;
    sellerId: string;
    sellerName: string;
    offer: TradeOffer;
    price: number;
    currency: 'seeds' | 'fieldNotes';
    timestamp: string;
}

// ─── FILTROS ───────────────────────────────────────────────
export type MarketFilter = 'ALL' | 'CARDS' | 'MATERIALS' | 'RESOURCES';
export type MarketSort = 'NEWEST' | 'CHEAPEST' | 'EXPENSIVE';

// ─── ESTADO ────────────────────────────────────────────────
export interface MarketState {
    listings: MarketListing[];
    myListings: MarketListing[];
    transactions: Transaction[];
    filter: MarketFilter;
    sort: MarketSort;
    searchQuery: string;
}
