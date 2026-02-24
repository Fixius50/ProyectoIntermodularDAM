/**
 * AVIS — Pantalla del Mercado (Marketplace)
 * Intercambio reactivo de cartas, materiales y recursos.
 */
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import { GlassCard } from '../components/GlassCard';
import { useMarket } from '../context/MarketContext';
import { MarketListing, MarketFilter, MarketSort } from '../types/market';
import { colors, typography, spacing, borders, shadows } from '../theme/theme';

// CSS animations
const marketAnimCSS = `
@keyframes cardEnter {
  0%   { opacity: 0; transform: scale(0.9) translateY(15px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes featuredGlow {
  0%, 100% { box-shadow: 0 0 6px rgba(218, 165, 32, 0.2); }
  50%      { box-shadow: 0 0 16px rgba(218, 165, 32, 0.4); }
}
@keyframes soldPop {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.1); }
  100% { transform: scale(1); }
}
`;

const FILTERS: { type: MarketFilter; label: string; icon: string }[] = [
    { type: 'ALL', label: 'Todo', icon: '🏪' },
    { type: 'CARDS', label: 'Cartas', icon: '🃏' },
    { type: 'MATERIALS', label: 'Materiales', icon: '🧱' },
    { type: 'RESOURCES', label: 'Recursos', icon: '🌾' },
];

const SORTS: { type: MarketSort; label: string }[] = [
    { type: 'NEWEST', label: '🕐 Recientes' },
    { type: 'CHEAPEST', label: '💰 Baratos' },
    { type: 'EXPENSIVE', label: '💎 Caros' },
];

// ─── TARJETA DE LISTADO ────────────────────────────────────
function ListingCard({
    listing,
    onBuy,
    index,
}: {
    listing: MarketListing;
    onBuy: (id: string) => void;
    index: number;
}) {
    const offerName = listing.offer.card?.name ||
        listing.offer.material?.name ||
        `${listing.offer.quantity} ${listing.offer.resourceType === 'seeds' ? 'Semillas' : 'Notas'}`;

    const offerIcon = listing.offer.card?.photo ||
        listing.offer.material?.icon ||
        (listing.offer.resourceType === 'seeds' ? '🌻' : '📝');

    const rarityColor = listing.offer.card?.rarity === 'LEGENDARY' ? '#DAA520' :
        listing.offer.card?.rarity === 'RARE' ? '#7C9A92' :
            listing.offer.card?.rarity === 'UNCOMMON' ? '#A8C5B8' : '#8B7355';

    const typeLabel = listing.offer.type === 'CARD' ? '🃏 Carta' :
        listing.offer.type === 'MATERIAL' ? '🧱 Material' : '🌾 Recurso';

    const currencyIcon = listing.currency === 'seeds' ? '🌱' : '📝';

    const timeAgo = (() => {
        const diff = Date.now() - new Date(listing.createdAt).getTime();
        if (diff < 3600000) return `${Math.floor(diff / 60000)} min`;
        return `${Math.floor(diff / 3600000)}h`;
    })();

    return (
        <div style={{
            animation: `cardEnter 0.4s ease-out ${index * 0.08}s both`,
            ...(listing.featured ? { animation: `cardEnter 0.4s ease-out ${index * 0.08}s both, featuredGlow 3s ease-in-out infinite` } : {}),
        }}>
            <GlassCard style={[styles.listingCard, listing.featured && styles.featuredCard]}>
                {listing.featured && (
                    <View style={styles.featuredBadge}>
                        <Text style={styles.featuredText}>⭐ Destacado</Text>
                    </View>
                )}

                <View style={styles.listingRow}>
                    <Text style={styles.listingIcon}>{offerIcon}</Text>
                    <View style={styles.listingInfo}>
                        <Text style={styles.listingName}>{offerName}</Text>
                        <View style={styles.listingMetaRow}>
                            <Text style={styles.listingType}>{typeLabel}</Text>
                            {listing.offer.card && (
                                <Text style={[styles.rarityBadge, { color: rarityColor }]}>
                                    {listing.offer.card.rarity}
                                </Text>
                            )}
                        </View>
                        <Text style={styles.listingSeller}>
                            {listing.sellerAvatar} {listing.sellerName} · hace {timeAgo}
                        </Text>
                    </View>
                </View>

                <View style={styles.listingFooter}>
                    <Text style={styles.priceText}>
                        {currencyIcon} {listing.price.toLocaleString()}
                    </Text>
                    <TouchableOpacity
                        style={styles.buyButton}
                        onPress={() => onBuy(listing.id)}
                        accessibilityLabel={`Comprar ${offerName} por ${listing.price}`}
                    >
                        <Text style={styles.buyButtonText}>Comprar</Text>
                    </TouchableOpacity>
                </View>
            </GlassCard>
        </div>
    );
}

// ─── PANTALLA PRINCIPAL ────────────────────────────────────
export function MarketScreen() {
    const { state, setFilter, setSort, setSearch, buyListing, getFilteredListings } = useMarket();
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [lastPurchased, setLastPurchased] = useState<string | null>(null);

    const listings = getFilteredListings();

    const handleBuy = useCallback((id: string) => {
        const listing = state.listings.find((l) => l.id === id);
        if (!listing) return;

        buyListing(id);
        setLastPurchased(listing.offer.card?.name || listing.offer.material?.name || 'Recurso');
        setShowPurchaseModal(true);
        setTimeout(() => setShowPurchaseModal(false), 2500);
    }, [state.listings, buyListing]);

    return (
        <View style={styles.container}>
            <style>{marketAnimCSS}</style>

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerEmoji}>🏪</Text>
                <View>
                    <Text style={styles.headerTitle}>Mercado</Text>
                    <Text style={styles.headerSubtitle}>
                        {listings.length} ofertas activas
                    </Text>
                </View>
            </View>

            {/* Barra de búsqueda */}
            <View style={styles.searchRow}>
                <TextInput
                    style={styles.searchInput}
                    value={state.searchQuery}
                    onChangeText={setSearch}
                    placeholder="Buscar carta, material..."
                    placeholderTextColor="rgba(74, 56, 42, 0.3)"
                    accessibilityLabel="Buscar en el mercado"
                />
            </View>

            {/* Filtros */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterRow}
            >
                {FILTERS.map((f) => (
                    <TouchableOpacity
                        key={f.type}
                        style={[styles.filterChip, state.filter === f.type && styles.filterChipActive]}
                        onPress={() => setFilter(f.type)}
                        accessibilityLabel={`Filtrar por ${f.label}`}
                    >
                        <Text style={styles.filterIcon}>{f.icon}</Text>
                        <Text style={[styles.filterLabel, state.filter === f.type && styles.filterLabelActive]}>
                            {f.label}
                        </Text>
                    </TouchableOpacity>
                ))}

                <View style={styles.filterSeparator} />

                {SORTS.map((s) => (
                    <TouchableOpacity
                        key={s.type}
                        style={[styles.filterChip, state.sort === s.type && styles.sortChipActive]}
                        onPress={() => setSort(s.type)}
                        accessibilityLabel={`Ordenar por ${s.label}`}
                    >
                        <Text style={[styles.filterLabel, state.sort === s.type && styles.filterLabelActive]}>
                            {s.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Listados */}
            <ScrollView contentContainerStyle={styles.listingsGrid}>
                {listings.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyEmoji}>🔍</Text>
                        <Text style={styles.emptyText}>No se encontraron ofertas</Text>
                        <Text style={styles.emptyHint}>Prueba con otros filtros</Text>
                    </View>
                ) : (
                    listings.map((listing, idx) => (
                        <ListingCard
                            key={listing.id}
                            listing={listing}
                            onBuy={handleBuy}
                            index={idx}
                        />
                    ))
                )}
            </ScrollView>

            {/* Modal de compra exitosa */}
            {showPurchaseModal && (
                <div style={{
                    position: 'fixed', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    zIndex: 1000,
                    animation: 'cardEnter 0.3s ease',
                }}>
                    <div style={{ animation: 'soldPop 0.4s ease' }}>
                        <View style={styles.purchaseModal}>
                            <Text style={{ fontSize: 48 }}>🎉</Text>
                            <Text style={styles.purchaseTitle}>¡Compra exitosa!</Text>
                            <Text style={styles.purchaseDesc}>
                                Has adquirido: {lastPurchased}
                            </Text>
                        </View>
                    </div>
                </div>
            )}
        </View>
    );
}

// ─── ESTILOS ───────────────────────────────────────────────
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: 48,
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.md,
    },
    headerEmoji: { fontSize: 32 },
    headerTitle: {
        fontSize: typography.sizeTitle,
        fontWeight: typography.weightBold,
        color: colors.text,
        fontFamily: typography.fontTitle,
    },
    headerSubtitle: {
        fontSize: typography.sizeSmall,
        color: colors.text,
        opacity: 0.6,
        fontFamily: typography.fontBody,
    },

    // Search
    searchRow: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.md,
    },
    searchInput: {
        backgroundColor: colors.glass,
        borderRadius: borders.radiusFull,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        fontSize: typography.sizeBody,
        color: colors.text,
        fontFamily: typography.fontBody,
        borderWidth: 1,
        borderColor: colors.glassBorder,
        //@ts-ignore
        outlineStyle: 'none',
    },

    // Filters
    filterRow: {
        paddingHorizontal: spacing.lg,
        gap: spacing.sm,
        paddingBottom: spacing.md,
        alignItems: 'center',
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borders.radiusFull,
        backgroundColor: colors.glass,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    filterChipActive: {
        backgroundColor: 'rgba(124, 154, 146, 0.15)',
        borderColor: colors.primary,
    },
    sortChipActive: {
        backgroundColor: 'rgba(218, 165, 32, 0.1)',
        borderColor: '#DAA520',
    },
    filterIcon: { fontSize: 14 },
    filterLabel: {
        fontSize: typography.sizeSmall,
        color: colors.text,
        opacity: 0.6,
        fontFamily: typography.fontBody,
    },
    filterLabelActive: {
        opacity: 1,
        fontWeight: typography.weightBold,
        color: colors.primary,
    },
    filterSeparator: {
        width: 1,
        height: 20,
        backgroundColor: colors.glassBorder,
        marginHorizontal: spacing.xs,
    },

    // Listings
    listingsGrid: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xl,
        gap: spacing.md,
    },
    listingCard: {
        gap: spacing.md,
    },
    featuredCard: {
        borderColor: 'rgba(218, 165, 32, 0.4)',
        borderWidth: 1,
    },
    featuredBadge: {
        position: 'absolute',
        top: -1,
        right: spacing.md,
        backgroundColor: '#DAA520',
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderBottomLeftRadius: borders.radiusSmall,
        borderBottomRightRadius: borders.radiusSmall,
    },
    featuredText: {
        fontSize: 9,
        color: '#FFF',
        fontWeight: typography.weightBold,
    },
    listingRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.md,
    },
    listingIcon: { fontSize: 36 },
    listingInfo: { flex: 1, gap: 2 },
    listingName: {
        fontSize: typography.sizeBody,
        fontWeight: typography.weightBold,
        color: colors.text,
        fontFamily: typography.fontTitle,
    },
    listingMetaRow: {
        flexDirection: 'row',
        gap: spacing.sm,
        alignItems: 'center',
    },
    listingType: {
        fontSize: typography.sizeSmall,
        color: colors.text,
        opacity: 0.6,
        fontFamily: typography.fontBody,
    },
    rarityBadge: {
        fontSize: 10,
        fontWeight: typography.weightBold,
        textTransform: 'uppercase' as any,
    },
    listingSeller: {
        fontSize: typography.sizeSmall,
        color: colors.text,
        opacity: 0.4,
        fontFamily: typography.fontBody,
    },
    listingFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: colors.glassBorder,
        paddingTop: spacing.sm,
    },
    priceText: {
        fontSize: typography.sizeBody,
        fontWeight: typography.weightBold,
        color: colors.primary,
        fontFamily: typography.fontBody,
    },
    buyButton: {
        backgroundColor: colors.primary,
        borderRadius: borders.radiusFull,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
    },
    buyButtonText: {
        fontSize: typography.sizeSmall,
        color: colors.white,
        fontWeight: typography.weightBold,
        fontFamily: typography.fontBody,
    },

    // Empty
    emptyState: {
        alignItems: 'center',
        paddingVertical: spacing.huge,
        gap: spacing.sm,
    },
    emptyEmoji: { fontSize: 48, opacity: 0.4 },
    emptyText: {
        fontSize: typography.sizeBody,
        color: colors.text,
        opacity: 0.5,
        fontFamily: typography.fontBody,
    },
    emptyHint: {
        fontSize: typography.sizeSmall,
        color: colors.text,
        opacity: 0.3,
        fontStyle: 'italic',
    },

    // Purchase modal
    purchaseModal: {
        backgroundColor: colors.background,
        borderRadius: borders.radiusLarge,
        padding: spacing.xl,
        alignItems: 'center',
        gap: spacing.md,
        ...shadows.glass,
        minWidth: 260,
    },
    purchaseTitle: {
        fontSize: typography.sizeTitle,
        fontWeight: typography.weightBold,
        color: colors.primary,
        fontFamily: typography.fontTitle,
    },
    purchaseDesc: {
        fontSize: typography.sizeBody,
        color: colors.text,
        fontFamily: typography.fontBody,
        textAlign: 'center',
    },
});
