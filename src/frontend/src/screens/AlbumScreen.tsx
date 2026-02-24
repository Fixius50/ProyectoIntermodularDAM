import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { BirdCardView } from '../components/BirdCardView';
import { GlassCard } from '../components/GlassCard';
import { useGame } from '../context/GameContext';
import { BirdCard, HabitatFilter } from '../types/types';
import { colors, typography, spacing, borders, shadows } from '../theme/theme';

// CSS animations for Album effects
const albumAnimCSS = `
@keyframes cardEntrance {
  0%   { opacity: 0; transform: translateY(15px) scale(0.95); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes emptyShimmer {
  0%   { background-position: -200px 0; }
  100% { background-position: 200px 0; }
}
@keyframes progressGlow {
  0%, 100% { box-shadow: 0 0 4px rgba(124, 154, 146, 0.2); }
  50%      { box-shadow: 0 0 12px rgba(124, 154, 146, 0.5); }
}
`;

const FILTERS: { type: HabitatFilter; label: string; icon: string }[] = [
    { type: 'TODOS', label: 'Todos', icon: '📋' },
    { type: 'AGUA', label: 'Agua', icon: '🌊' },
    { type: 'BOSQUE', label: 'Bosque', icon: '🌲' },
    { type: 'MONTAÑA', label: 'Montaña', icon: '⛰️' },
];

/**
 * Pantalla del Álbum (Colección)
 * Objetivo: Gestión y consulta de la colección de cartas.
 * - Grid de cartas con filtros por hábitat
 * - Modal fullscreen con detalle (Cara A / Cara B con flip)
 */
export function AlbumScreen() {
    const { state } = useGame();
    const { player } = state;

    const [activeFilter, setActiveFilter] = useState<HabitatFilter>('TODOS');
    const [selectedCard, setSelectedCard] = useState<BirdCard | null>(null);

    const filteredCards = activeFilter === 'TODOS'
        ? player.collection
        : player.collection.filter((c) => c.habitat === activeFilter);

    // Count birds per habitat for filter badges
    const habitatCounts = useMemo(() => {
        const counts: Record<string, number> = { TODOS: player.collection.length };
        player.collection.forEach((c) => {
            counts[c.habitat] = (counts[c.habitat] || 0) + 1;
        });
        return counts;
    }, [player.collection]);

    // Unique habitats explored
    const habitatsExplored = useMemo(() => {
        const habitats = new Set(player.collection.map((c) => c.habitat));
        return habitats.size;
    }, [player.collection]);
    const TOTAL_HABITATS = FILTERS.length - 1; // exclude TODOS

    const handleOpenCard = useCallback((card: BirdCard) => {
        setSelectedCard(card);
    }, []);

    const handleCloseCard = useCallback(() => {
        setSelectedCard(null);
    }, []);

    return (
        <View style={styles.container}>
            <style>{albumAnimCSS}</style>

            {/* Título */}
            <Text style={styles.title}>📖 Álbum de Aves</Text>
            <Text style={styles.subtitle}>
                {player.collection.length} aves en tu colección
            </Text>

            {/* Barra de progreso de hábitats */}
            <View style={styles.progressSection}>
                <Text style={styles.progressLabel}>
                    🌍 Hábitats explorados: {habitatsExplored}/{TOTAL_HABITATS}
                </Text>
                <View style={styles.progressBarContainer}>
                    <div style={{
                        height: 6, borderRadius: 3,
                        width: `${(habitatsExplored / TOTAL_HABITATS) * 100}%`,
                        background: 'linear-gradient(90deg, #7C9A92, #A8C5B8)',
                        transition: 'width 0.5s ease',
                        animation: habitatsExplored > 0 ? 'progressGlow 2s ease-in-out infinite' : 'none',
                    }} />
                </View>
            </View>

            {/* Filtros */}
            <View style={styles.filterRow}>
                {FILTERS.map((filter) => {
                    const isActive = activeFilter === filter.type;
                    const count = habitatCounts[filter.type] || 0;
                    return (
                        <TouchableOpacity
                            key={filter.type}
                            style={[styles.filterTab, isActive && styles.filterTabActive]}
                            onPress={() => setActiveFilter(filter.type)}
                            accessibilityLabel={`Filtrar por ${filter.label}. ${count} aves`}
                            accessibilityRole="tab"
                        >
                            <Text style={styles.filterIcon}>{filter.icon}</Text>
                            <Text style={[styles.filterLabel, isActive && styles.filterLabelActive]}>
                                {filter.label}
                            </Text>
                            {count > 0 && (
                                <View style={styles.filterBadge}>
                                    <Text style={styles.filterBadgeText}>{count}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Grid de Cartas */}
            <ScrollView contentContainerStyle={styles.grid}>
                {filteredCards.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyEmoji}>🪶</Text>
                        <Text style={styles.emptyText}>No tienes aves de este tipo aún</Text>
                        <Text style={styles.emptyHint}>
                            💡 ¡Explora biomas en Expedición y craftea en el Taller para conseguir cartas!
                        </Text>
                    </View>
                ) : (
                    filteredCards.map((card, idx) => (
                        <div key={card.id} style={{
                            animation: `cardEntrance 0.4s ease-out ${idx * 0.08}s both`,
                        }}>
                            <BirdCardView
                                card={card}
                                mode="mini"
                                onPress={() => handleOpenCard(card)}
                            />
                        </div>
                    ))
                )}
            </ScrollView>

            {/* Modal de Detalle */}
            <Modal
                visible={selectedCard !== null}
                animationType="slide"
                transparent={true}
                onRequestClose={handleCloseCard}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* Botón Cerrar */}
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={handleCloseCard}
                            accessibilityLabel="Cerrar vista detallada de la carta"
                            accessibilityRole="button"
                        >
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>

                        {/* Carta en modo Full */}
                        {selectedCard && (
                            <ScrollView contentContainerStyle={styles.cardDetailScroll}>
                                <BirdCardView card={selectedCard} mode="full" />

                                {/* Detalles adicionales */}
                                <View style={styles.detailFooter}>
                                    <Text style={styles.detailScientific}>
                                        💬 {selectedCard.scientificName}
                                    </Text>
                                    <Text style={styles.detailHabitat}>
                                        🌿 Hábitat: {selectedCard.habitat}
                                    </Text>
                                </View>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: 48,
    },
    title: {
        fontSize: typography.sizeTitle,
        fontWeight: typography.weightBold,
        color: colors.text,
        textAlign: 'center',
        fontFamily: typography.fontTitle,
    },
    subtitle: {
        fontSize: typography.sizeCaption,
        color: colors.text,
        opacity: 0.6,
        textAlign: 'center',
        marginBottom: spacing.sm,
        fontFamily: typography.fontBody,
    },

    // Progress
    progressSection: {
        alignItems: 'center',
        marginBottom: spacing.lg,
        paddingHorizontal: spacing.xl,
    },
    progressLabel: {
        fontSize: typography.sizeSmall,
        color: colors.primary,
        fontWeight: typography.weightBold,
        marginBottom: spacing.xs,
        fontFamily: typography.fontBody,
    },
    progressBarContainer: {
        width: '60%' as any,
        height: 6,
        backgroundColor: 'rgba(124, 154, 146, 0.15)',
        borderRadius: 3,
        overflow: 'hidden',
    },

    // Filters
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacing.sm,
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.lg,
    },
    filterTab: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        backgroundColor: colors.glass,
        borderRadius: borders.radiusFull,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    filterTabActive: {
        borderColor: colors.primary,
        backgroundColor: 'rgba(124, 154, 146, 0.15)',
    },
    filterIcon: {
        fontSize: 14,
    },
    filterLabel: {
        fontSize: typography.sizeCaption,
        color: colors.text,
        opacity: 0.6,
        fontFamily: typography.fontBody,
    },
    filterLabelActive: {
        opacity: 1,
        color: colors.primary,
        fontWeight: typography.weightBold,
    },
    filterBadge: {
        backgroundColor: colors.primary,
        borderRadius: 8,
        minWidth: 16,
        height: 16,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    filterBadgeText: {
        fontSize: 9,
        color: colors.white,
        fontWeight: typography.weightBold,
    },

    // Grid
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: spacing.lg,
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xxl,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: spacing.huge,
        gap: spacing.sm,
    },
    emptyEmoji: {
        fontSize: 48,
        opacity: 0.4,
    },
    emptyText: {
        fontSize: typography.sizeBody,
        color: colors.text,
        opacity: 0.5,
        textAlign: 'center',
        fontStyle: 'italic',
        fontFamily: typography.fontBody,
    },
    emptyHint: {
        fontSize: typography.sizeSmall,
        color: colors.primary,
        textAlign: 'center',
        fontFamily: typography.fontBody,
        paddingHorizontal: spacing.xl,
    },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: colors.overlay,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    modalContent: {
        width: '100%' as any,
        maxWidth: 400,
        maxHeight: '90%' as any,
        backgroundColor: colors.background,
        borderRadius: borders.radiusLarge,
        overflow: 'hidden',
        ...shadows.glass,
    },
    closeButton: {
        position: 'absolute',
        top: spacing.md,
        left: spacing.md,
        zIndex: 100,
        backgroundColor: colors.glass,
        borderRadius: borders.radiusFull,
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.glassBorder,
        //@ts-ignore
        backdropFilter: 'blur(10px)',
    },
    closeButtonText: {
        fontSize: typography.sizeBody,
        color: colors.text,
        fontWeight: typography.weightBold,
    },
    cardDetailScroll: {
        padding: 0,
    },
    detailFooter: {
        alignItems: 'center',
        paddingVertical: spacing.md,
        gap: spacing.xs,
    },
    detailScientific: {
        fontSize: typography.sizeCaption,
        color: colors.text,
        fontStyle: 'italic',
        fontFamily: typography.fontBody,
    },
    detailHabitat: {
        fontSize: typography.sizeSmall,
        color: colors.primary,
        fontWeight: typography.weightBold,
    },
});
