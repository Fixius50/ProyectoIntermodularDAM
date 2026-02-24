/**
 * AVIS — MarketContext
 * Gestiona el estado del Mercado: listados, compra/venta, transacciones.
 * Modo mock para desarrollo sin backend.
 */
import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import {
    MarketState,
    MarketListing,
    MarketFilter,
    MarketSort,
    Transaction,
    TradeOffer,
} from '../types/market';

// ─── ACCIONES ──────────────────────────────────────────────
type MarketAction =
    | { type: 'SET_FILTER'; payload: MarketFilter }
    | { type: 'SET_SORT'; payload: MarketSort }
    | { type: 'SET_SEARCH'; payload: string }
    | { type: 'BUY_LISTING'; payload: string }
    | { type: 'ADD_LISTING'; payload: MarketListing }
    | { type: 'CANCEL_LISTING'; payload: string }
    | { type: 'ADD_TRANSACTION'; payload: Transaction };

// ─── DATOS MOCK ────────────────────────────────────────────
const mockListings: MarketListing[] = [
    {
        id: 'mkt-1', sellerId: 'user-2', sellerName: 'Ornitóloga', sellerAvatar: '👩‍🔬',
        offer: { type: 'CARD', card: { id: 'bc-10', name: 'Flamenco', photo: '🦩', rarity: 'RARE', attack: 7, defense: 4, postures: ['IDLE', 'ALERT'], scientificName: 'Phoenicopterus roseus', habitat: 'Agua', curiosity: 'Pueden dormir sobre una pata' } as any },
        price: 300, currency: 'seeds', status: 'ACTIVE', createdAt: new Date(Date.now() - 7200000).toISOString(), expiresAt: new Date(Date.now() + 86400000).toISOString(), featured: true,
    },
    {
        id: 'mkt-2', sellerId: 'user-3', sellerName: 'Explorador', sellerAvatar: '🧭',
        offer: { type: 'MATERIAL', material: { id: 'mat-acuarela', name: 'Acuarela', icon: '🎨' } as any },
        price: 50, currency: 'seeds', status: 'ACTIVE', createdAt: new Date(Date.now() - 3600000).toISOString(), expiresAt: new Date(Date.now() + 86400000 * 2).toISOString(), featured: false,
    },
    {
        id: 'mkt-3', sellerId: 'user-5', sellerName: 'Coleccionista', sellerAvatar: '📖',
        offer: { type: 'CARD', card: { id: 'bc-11', name: 'Cóndor Andino', photo: '🦅', rarity: 'LEGENDARY', attack: 10, defense: 8, postures: ['IDLE', 'ALERT', 'DISPLAY'], scientificName: 'Vultur gryphus', habitat: 'Montaña', curiosity: 'Envergadura alar de hasta 3.3m' } as any },
        price: 800, currency: 'seeds', status: 'ACTIVE', createdAt: new Date(Date.now() - 1800000).toISOString(), expiresAt: new Date(Date.now() + 86400000 * 3).toISOString(), featured: true,
    },
    {
        id: 'mkt-4', sellerId: 'user-4', sellerName: 'Guardabosques', sellerAvatar: '🌲',
        offer: { type: 'RESOURCE', resourceType: 'fieldNotes', quantity: 10 },
        price: 200, currency: 'seeds', status: 'ACTIVE', createdAt: new Date(Date.now() - 600000).toISOString(), expiresAt: new Date(Date.now() + 86400000).toISOString(), featured: false,
    },
    {
        id: 'mkt-5', sellerId: 'user-2', sellerName: 'Ornitóloga', sellerAvatar: '👩‍🔬',
        offer: { type: 'CARD', card: { id: 'bc-12', name: 'Colibrí', photo: '🐦', rarity: 'UNCOMMON', attack: 3, defense: 2, postures: ['IDLE', 'DISPLAY'], scientificName: 'Trochilidae', habitat: 'Bosque', curiosity: 'Puede volar hacia atrás' } as any },
        price: 120, currency: 'seeds', status: 'ACTIVE', createdAt: new Date(Date.now() - 900000).toISOString(), expiresAt: new Date(Date.now() + 86400000 * 2).toISOString(), featured: false,
    },
];

// ─── ESTADO INICIAL ────────────────────────────────────────
const initialState: MarketState = {
    listings: mockListings,
    myListings: [],
    transactions: [],
    filter: 'ALL',
    sort: 'NEWEST',
    searchQuery: '',
};

// ─── REDUCER ───────────────────────────────────────────────
function marketReducer(state: MarketState, action: MarketAction): MarketState {
    switch (action.type) {
        case 'SET_FILTER':
            return { ...state, filter: action.payload };

        case 'SET_SORT':
            return { ...state, sort: action.payload };

        case 'SET_SEARCH':
            return { ...state, searchQuery: action.payload };

        case 'BUY_LISTING':
            return {
                ...state,
                listings: state.listings.map((l) =>
                    l.id === action.payload ? { ...l, status: 'SOLD' as const } : l
                ),
            };

        case 'ADD_LISTING':
            return {
                ...state,
                listings: [action.payload, ...state.listings],
                myListings: [action.payload, ...state.myListings],
            };

        case 'CANCEL_LISTING':
            return {
                ...state,
                listings: state.listings.map((l) =>
                    l.id === action.payload ? { ...l, status: 'CANCELLED' as const } : l
                ),
                myListings: state.myListings.map((l) =>
                    l.id === action.payload ? { ...l, status: 'CANCELLED' as const } : l
                ),
            };

        case 'ADD_TRANSACTION':
            return {
                ...state,
                transactions: [action.payload, ...state.transactions],
            };

        default:
            return state;
    }
}

// ─── CONTEXT ───────────────────────────────────────────────
interface MarketContextType {
    state: MarketState;
    setFilter: (filter: MarketFilter) => void;
    setSort: (sort: MarketSort) => void;
    setSearch: (query: string) => void;
    buyListing: (listingId: string) => void;
    createListing: (offer: TradeOffer, price: number, currency: 'seeds' | 'fieldNotes') => void;
    cancelListing: (listingId: string) => void;
    getFilteredListings: () => MarketListing[];
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

// ─── PROVIDER ──────────────────────────────────────────────
export function MarketProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(marketReducer, initialState);

    const setFilter = useCallback((filter: MarketFilter) => {
        dispatch({ type: 'SET_FILTER', payload: filter });
    }, []);

    const setSort = useCallback((sort: MarketSort) => {
        dispatch({ type: 'SET_SORT', payload: sort });
    }, []);

    const setSearch = useCallback((query: string) => {
        dispatch({ type: 'SET_SEARCH', payload: query });
    }, []);

    const buyListing = useCallback((listingId: string) => {
        const listing = state.listings.find((l) => l.id === listingId);
        if (!listing || listing.status !== 'ACTIVE') return;

        dispatch({ type: 'BUY_LISTING', payload: listingId });

        const tx: Transaction = {
            id: `tx-${Date.now()}`,
            listingId,
            buyerId: 'user-1',
            buyerName: 'Naturalista',
            sellerId: listing.sellerId,
            sellerName: listing.sellerName,
            offer: listing.offer,
            price: listing.price,
            currency: listing.currency,
            timestamp: new Date().toISOString(),
        };
        dispatch({ type: 'ADD_TRANSACTION', payload: tx });
    }, [state.listings]);

    const createListing = useCallback((offer: TradeOffer, price: number, currency: 'seeds' | 'fieldNotes') => {
        const listing: MarketListing = {
            id: `mkt-${Date.now()}`,
            sellerId: 'user-1',
            sellerName: 'Naturalista',
            sellerAvatar: '🧑‍🔬',
            offer,
            price,
            currency,
            status: 'ACTIVE',
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 86400000 * 3).toISOString(),
            featured: false,
        };
        dispatch({ type: 'ADD_LISTING', payload: listing });
    }, []);

    const cancelListing = useCallback((listingId: string) => {
        dispatch({ type: 'CANCEL_LISTING', payload: listingId });
    }, []);

    const getFilteredListings = useCallback((): MarketListing[] => {
        let result = state.listings.filter((l) => l.status === 'ACTIVE');

        // Filter
        if (state.filter === 'CARDS') result = result.filter((l) => l.offer.type === 'CARD');
        else if (state.filter === 'MATERIALS') result = result.filter((l) => l.offer.type === 'MATERIAL');
        else if (state.filter === 'RESOURCES') result = result.filter((l) => l.offer.type === 'RESOURCE');

        // Search
        if (state.searchQuery) {
            const q = state.searchQuery.toLowerCase();
            result = result.filter((l) => {
                const name = l.offer.card?.name || l.offer.material?.name || l.offer.resourceType || '';
                return name.toLowerCase().includes(q) || l.sellerName.toLowerCase().includes(q);
            });
        }

        // Sort
        if (state.sort === 'CHEAPEST') result.sort((a, b) => a.price - b.price);
        else if (state.sort === 'EXPENSIVE') result.sort((a, b) => b.price - a.price);
        else result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        // Featured first
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

        return result;
    }, [state.listings, state.filter, state.sort, state.searchQuery]);

    return (
        <MarketContext.Provider value={{
            state, setFilter, setSort, setSearch,
            buyListing, createListing, cancelListing, getFilteredListings,
        }}>
            {children}
        </MarketContext.Provider>
    );
}

// ─── HOOK ──────────────────────────────────────────────────
export function useMarket(): MarketContextType {
    const context = useContext(MarketContext);
    if (!context) {
        throw new Error('useMarket debe usarse dentro de <MarketProvider>');
    }
    return context;
}
