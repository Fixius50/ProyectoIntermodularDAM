import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { GlassCard } from '../components/GlassCard';
import { ResourceCounter } from '../components/ResourceCounter';
import { WeatherBackground } from '../components/WeatherBackground';
import { BirdCardView } from '../components/BirdCardView';
import { useGame } from '../context/GameContext';
import { fetchCurrentWeather } from '../services/weatherService';
import { colors, typography, spacing, borders, shadows } from '../theme/theme';
import { BirdCard, HabitatFilter } from '../types/types';

/* ─── CSS Animaciones de Colección ───────────────────────── */
const collectionCSS = `
@keyframes treeSway {
  0%, 100% { transform: rotate(0deg); }
  25%      { transform: rotate(0.5deg); }
  75%      { transform: rotate(-0.5deg); }
}
@keyframes birdPerch {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  30%      { transform: translateY(-5px) rotate(-3deg); }
  60%      { transform: translateY(-2px) rotate(1.5deg); }
}
@keyframes birdHop {
  0%       { transform: translateY(0) scale(1); }
  25%      { transform: translateY(-14px) scale(1.15); }
  50%      { transform: translateY(-4px) scale(1.05); }
  100%     { transform: translateY(0) scale(1); }
}
@keyframes heartBurst {
  0%       { transform: translateY(0) scale(0); opacity: 0; }
  15%      { transform: translateY(-6px) scale(1.3); opacity: 1; }
  55%      { transform: translateY(-22px) scale(1); opacity: 0.7; }
  100%     { transform: translateY(-40px) scale(0.5); opacity: 0; }
}
@keyframes namePopIn {
  0%       { transform: scale(0.5) translateY(10px); opacity: 0; }
  60%      { transform: scale(1.05) translateY(-2px); opacity: 1; }
  100%     { transform: scale(1) translateY(0); opacity: 1; }
}
@keyframes modeSwitchGlow {
  0%, 100% { box-shadow: 0 0 4px rgba(124, 154, 146, 0.2); }
  50%      { box-shadow: 0 0 12px rgba(124, 154, 146, 0.5); }
}
`;

/* ─── Configuración ──────────────────────────────────────── */
const WEATHER_ICONS: Record<string, string> = {
    SOL: '☀️', LLUVIA: '🌧️', VIENTO: '💨', NOCHE: '🌙', NUBLADO: '☁️', NIEVE: '❄️', TORMENTA: '⛈️',
};

const WEATHER_LABELS: Record<string, string> = {
    SOL: 'Soleado', LLUVIA: 'Lluvioso', VIENTO: 'Ventoso',
    NOCHE: 'Noche despejada', NUBLADO: 'Nublado', NIEVE: 'Nevando', TORMENTA: 'Tormenta',
};

const BIRD_EMOJIS: Record<string, string> = {
    'BOSQUE': '🐦', 'MONTAÑA': '🦅', 'AGUA': '🕊️', 'COSTA': '🐧', 'TODOS': '🕊️'
};

const BIRD_POSITIONS = [
    { top: 20, left: 16, scale: 1.1 },
    { top: 42, right: 6, scale: 0.95 },
    { top: 65, left: 32, scale: 1.0 },
    { top: 12, right: 22, scale: 0.85 },
    { top: 54, left: 4, scale: 0.9 },
];

const HABITAT_FILTERS: { type: HabitatFilter; label: string; icon: string }[] = [
    { type: 'TODOS', label: 'Todos', icon: '📋' },
    { type: 'AGUA', label: 'Agua', icon: '🌊' },
    { type: 'BOSQUE', label: 'Bosque', icon: '🌲' },
    { type: 'MONTAÑA', label: 'Montaña', icon: '⛰️' },
];

type ViewMode = 'TREE' | 'GRID';

export function CollectionScreen() {
    const { state, dispatch } = useGame();
    const { weather, player } = state;
    const [viewMode, setViewMode] = useState<ViewMode>('TREE');
    const [activeFilter, setActiveFilter] = useState<HabitatFilter>('TODOS');
    const [selectedBird, setSelectedBird] = useState<BirdCard | null>(null);
    const [tappedBirdId, setTappedBirdId] = useState<string | null>(null);
    const [feedMessage, setFeedMessage] = useState<string | null>(null);

    // Filtered collection for GRID view
    const filteredCards = useMemo(() => {
        return activeFilter === 'TODOS'
            ? player.collection
            : player.collection.filter((c) => c.habitat === activeFilter);
    }, [player.collection, activeFilter]);

    // Top 5 birds for TREE view
    const treeBirds = useMemo(() => player.collection.slice(0, 5), [player.collection]);

    const weatherIcon = WEATHER_ICONS[weather.condition] || '☀️';
    const weatherLabel = WEATHER_LABELS[weather.condition] || weather.condition;

    // ─── EFFECTS ───────────────────────────────────────────────
    useEffect(() => {
        const loadRealWeather = async () => {
            try {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(async (position) => {
                        const { latitude, longitude } = position.coords;
                        const realWeather = await fetchCurrentWeather(latitude, longitude);
                        dispatch({ type: 'SET_WEATHER', payload: realWeather });
                    });
                }
            } catch (error) {
                console.warn('Could not load real weather', error);
            }
        };
        loadRealWeather();
    }, [dispatch]);

    // ─── HANDLERS ──────────────────────────────────────────────
    const handleBirdTap = useCallback((bird: BirdCard) => {
        setTappedBirdId(bird.id);
        setTimeout(() => {
            setTappedBirdId(null);
            setSelectedBird(bird);
        }, 800);
    }, []);

    const handleFeedBird = useCallback(() => {
        if (player.resources.seeds >= 5) {
            dispatch({ type: 'UPDATE_SEEDS', payload: -5 });
            setFeedMessage('¡El ave ha comido felizmente! 💖');
            setTimeout(() => setFeedMessage(null), 3000);
        } else {
            setFeedMessage('No tienes suficientes semillas (Necesitas 5). 🌰');
            setTimeout(() => setFeedMessage(null), 3000);
        }
    }, [player.resources.seeds, dispatch]);

    const handleCloseModal = useCallback(() => {
        setSelectedBird(null);
        setFeedMessage(null);
    }, []);

    return (
        <WeatherBackground condition={weather.condition}>
            <style>{collectionCSS}</style>

            {/* ── Header Flotante ───────────────────────────── */}
            <View style={styles.topPanel}>
                <View style={styles.headerRow}>
                    <View style={styles.weatherInfo}>
                        <Text style={styles.weatherIcon}>{weatherIcon}</Text>
                        <View>
                            <Text style={styles.weatherTemp}>{weather.temperature}°C</Text>
                            <Text style={styles.weatherLabel}>{weatherLabel}</Text>
                        </View>
                    </View>
                    <View style={styles.statsGroup}>
                        <ResourceCounter icon="🌰" value={player.resources.seeds} />
                        <ResourceCounter icon="📖" value={player.collection.length} />
                    </View>
                </View>

                {/* Alternador de Vista (Tree / Grid) */}
                <View style={styles.modeToggleGroup}>
                    <TouchableOpacity
                        style={[styles.modeButton, viewMode === 'TREE' && styles.modeButtonActive]}
                        onPress={() => setViewMode('TREE')}
                    >
                        <Text style={[styles.modeButtonText, viewMode === 'TREE' && styles.modeButtonTextActive]}>
                            🌳 Arboreto
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.modeButton, viewMode === 'GRID' && styles.modeButtonActive]}
                        onPress={() => setViewMode('GRID')}
                    >
                        <Text style={[styles.modeButtonText, viewMode === 'GRID' && styles.modeButtonTextActive]}>
                            📂 Cuaderno
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* ── Contenido Principal ────────────────────────── */}
            {viewMode === 'TREE' ? (
                <View style={styles.treeContainer}>
                    {/* Árbol interactivo */}
                    <div style={{
                        animation: 'treeSway 7s ease-in-out infinite',
                        transformOrigin: 'bottom center',
                        fontSize: 160,
                        marginTop: 40,
                    }}>🌳</div>

                    {/* Pájaros en el árbol */}
                    {treeBirds.map((bird, i) => (
                        <TouchableOpacity
                            key={bird.id}
                            style={[styles.birdPerch, BIRD_POSITIONS[i % BIRD_POSITIONS.length]] as any}
                            onPress={() => handleBirdTap(bird)}
                        >
                            <div style={{
                                animation: tappedBirdId === bird.id
                                    ? 'birdHop 0.6s ease-out'
                                    : `birdPerch 3s ease-in-out ${i * 0.5}s infinite`,
                                fontSize: 40,
                            }}>
                                {BIRD_EMOJIS[bird.habitat] || '🐦'}
                            </div>
                            {tappedBirdId === bird.id && (
                                <View style={styles.heartBurstContainer}>
                                    {['❤️', '💖', '✨'].map((e, idx) => (
                                        <div key={idx} style={{
                                            animation: `heartBurst 1s ease-out ${idx * 0.1}s forwards`,
                                            position: 'absolute',
                                            fontSize: 14,
                                        }}>{e}</div>
                                    ))}
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}

                    <View style={styles.treeHint}>
                        <Text style={styles.hintText}>Los pájaros de tu colección descansan aquí</Text>
                    </View>
                </View>
            ) : (
                <View style={styles.gridViewContainer}>
                    {/* Filtros de Hábitat */}
                    <View style={styles.filterRow}>
                        {HABITAT_FILTERS.map((f) => (
                            <TouchableOpacity
                                key={f.type}
                                style={[styles.filterChip, activeFilter === f.type && styles.filterChipActive]}
                                onPress={() => setActiveFilter(f.type)}
                            >
                                <Text style={[styles.filterChipText, activeFilter === f.type && styles.filterChipTextActive]}>
                                    {f.icon} {f.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Grilla de aves */}
                    <ScrollView contentContainerStyle={styles.cardGrid}>
                        {filteredCards.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>Todavía no tienes aves en este hábitat 🪶</Text>
                            </View>
                        ) : (
                            filteredCards.map((card) => (
                                <BirdCardView
                                    key={card.id}
                                    card={card}
                                    mode="mini"
                                    onPress={() => setSelectedBird(card)}
                                />
                            ))
                        )}
                    </ScrollView>
                </View>
            )}

            {/* ── Modal de Detalle ─────────────────────────── */}
            <Modal
                visible={!!selectedBird}
                transparent={true}
                animationType="fade"
                onRequestClose={handleCloseModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>

                        {selectedBird && (
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>{selectedBird.name}</Text>
                                    <Text style={styles.modalScientific}>{selectedBird.scientificName}</Text>
                                </View>

                                <BirdCardView card={selectedBird} mode="full" />

                                <View style={styles.interactionPanel}>
                                    {feedMessage ? (
                                        <GlassCard style={styles.feedMessage}>
                                            <Text style={styles.feedMessageText}>{feedMessage}</Text>
                                        </GlassCard>
                                    ) : (
                                        <TouchableOpacity style={styles.actionButton} onPress={handleFeedBird}>
                                            <Text style={styles.actionButtonText}>🌰 Alimentar (5)</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>
        </WeatherBackground>
    );
}

const styles = StyleSheet.create({
    topPanel: {
        paddingTop: 60,
        paddingHorizontal: spacing.xl,
        gap: spacing.lg,
        zIndex: 100,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    weatherInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        backgroundColor: colors.glass,
        padding: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: borders.radiusMedium,
        borderWidth: 1,
        borderColor: colors.glassBorder,
    },
    weatherIcon: {
        fontSize: 24,
    },
    weatherTemp: {
        fontSize: 16,
        fontWeight: typography.weightBold,
        color: colors.text,
    },
    weatherLabel: {
        fontSize: 10,
        color: colors.text,
        opacity: 0.6,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    statsGroup: {
        flexDirection: 'row',
        gap: spacing.sm,
    },

    // Mode Toggle
    modeToggleGroup: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: borders.radiusFull,
        padding: 4,
        alignSelf: 'center',
    },
    modeButton: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xl,
        borderRadius: borders.radiusFull,
    },
    modeButtonActive: {
        backgroundColor: colors.background,
        ...shadows.card,
    },
    modeButtonText: {
        fontSize: 12,
        fontWeight: typography.weightSemiBold,
        color: colors.text,
        opacity: 0.5,
    },
    modeButtonTextActive: {
        opacity: 1,
        color: colors.primaryDark,
    },

    // Tree View
    treeContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    birdPerch: {
        position: 'absolute',
        zIndex: 10,
    },
    heartBurstContainer: {
        position: 'absolute',
        top: -20,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    treeHint: {
        position: 'absolute',
        bottom: 40,
        backgroundColor: colors.glass,
        paddingVertical: 6,
        paddingHorizontal: spacing.lg,
        borderRadius: borders.radiusFull,
    },
    hintText: {
        fontSize: 11,
        color: colors.text,
        opacity: 0.6,
        fontStyle: 'italic',
    },

    // Grid View
    gridViewContainer: {
        flex: 1,
        paddingTop: spacing.md,
    },
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacing.sm,
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.md,
    },
    filterChip: {
        paddingVertical: 6,
        paddingHorizontal: spacing.md,
        borderRadius: borders.radiusFull,
        backgroundColor: colors.glass,
        borderWidth: 1,
        borderColor: colors.glassBorder,
    },
    filterChipActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primaryDark,
    },
    filterChipText: {
        fontSize: 11,
        color: colors.text,
    },
    filterChipTextActive: {
        color: colors.white,
        fontWeight: typography.weightBold,
    },
    cardGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: spacing.md,
        paddingHorizontal: spacing.lg,
        paddingBottom: 100,
    },
    emptyContainer: {
        padding: spacing.huge,
        alignItems: 'center',
    },
    emptyText: {
        color: colors.text,
        opacity: 0.5,
        fontStyle: 'italic',
    },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    modalContent: {
        width: '100%',
        maxWidth: 420,
        backgroundColor: colors.background,
        borderRadius: borders.radiusLarge,
        padding: spacing.xl,
        position: 'relative',
        maxHeight: '90%',
    },
    closeButton: {
        position: 'absolute',
        top: spacing.md,
        right: spacing.md,
        zIndex: 10,
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButtonText: {
        fontSize: 20,
        color: colors.text,
        opacity: 0.5,
    },
    modalHeader: {
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: typography.weightBold,
        color: colors.text,
    },
    modalScientific: {
        fontSize: 12,
        fontStyle: 'italic',
        color: colors.primaryDark,
        opacity: 0.8,
    },
    interactionPanel: {
        marginTop: spacing.xl,
        alignItems: 'center',
    },
    actionButton: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.huge,
        borderRadius: borders.radiusFull,
        ...shadows.card,
    },
    actionButtonText: {
        color: colors.white,
        fontWeight: typography.weightBold,
    },
    feedMessage: {
        padding: spacing.md,
        width: '100%',
        alignItems: 'center',
    },
    feedMessageText: {
        color: colors.primaryDark,
        fontWeight: typography.weightSemiBold,
    }
});
