import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { GlassCard } from '../components/GlassCard';
import { ResourceCounter } from '../components/ResourceCounter';
import { useGame } from '../context/GameContext';
import { useCoop } from '../context/CoopContext';
import { BiomeType, BaitType, CraftItem, CraftItemType } from '../types/types';
import { CoopTab, Invitation, TrainingSession, CoopExpedition } from '../types/coop';
import { colors, typography, spacing, borders, shadows } from '../theme/theme';

// CSS animations for Expedición effects
const expedicionAnimCSS = `
@keyframes goldenPulse {
  0%, 100% { box-shadow: 0 0 8px rgba(255, 193, 7, 0.3); }
  50%      { box-shadow: 0 0 24px rgba(255, 193, 7, 0.7); }
}
@keyframes cameraFlash {
  0%   { opacity: 0; }
  10%  { opacity: 0.9; }
  100% { opacity: 0; }
}
@keyframes rainDropBiome {
  0%, 100% { transform: translateY(0); opacity: 0.8; }
  50%      { transform: translateY(3px); opacity: 1; }
}
`;

// ─── DATOS DE BIOMAS Y CEBOS ────────────────────────────────
const BIOMES: { type: BiomeType; icon: string; label: string; color: string }[] = [
    { type: 'BOSQUE', icon: '🌲', label: 'Bosque', color: colors.bosque },
    { type: 'COSTA', icon: '🏖️', label: 'Costa', color: colors.costa },
    { type: 'MONTAÑA', icon: '⛰️', label: 'Montaña', color: colors.montaña },
];

const BAITS: { type: BaitType; icon: string; label: string }[] = [
    { type: 'GUSANO', icon: '🪱', label: 'Gusano' },
    { type: 'FRUTA', icon: '🍎', label: 'Fruta' },
    { type: 'PEZ', icon: '🐟', label: 'Pez' },
];

// ─── TYPES & CONSTANTS ─────────────────────────────────────
type ExpedicionSubTab = 'EXPLORA' | 'TALLER' | 'COOP';

const SUB_TABS: { id: ExpedicionSubTab; label: string; icon: string }[] = [
    { id: 'EXPLORA', label: 'Explora', icon: '🔭' },
    { id: 'TALLER', label: 'Taller', icon: '🔨' },
    { id: 'COOP', label: 'Coop', icon: '👥' },
];

/**
 * Pantalla Unificada de Expedición
 * Agrupa Exploración, Taller y Cooperación.
 */
export function ExpedicionScreen() {
    const { state, dispatch } = useGame();
    const coop = useCoop();
    const [activeSubTab, setActiveSubTab] = useState<ExpedicionSubTab>('EXPLORA');
    const { expedition, weather } = state;

    const [selectedBiome, setSelectedBiome] = useState<BiomeType | null>(null);
    const [selectedBait, setSelectedBait] = useState<BaitType | null>(null);

    // Pista dorada: el jugador tiene Notas de Campo
    const hasFieldNotes = useMemo(() => state.player.resources.fieldNotes > 0, [state.player.resources.fieldNotes]);
    const isRaining = weather.condition === 'LLUVIA';
    const [showMinigame, setShowMinigame] = useState(false);
    const [sliderValue, setSliderValue] = useState(0);
    const [focusResult, setFocusResult] = useState<'none' | 'success' | 'fail'>('none');
    const [timeLeft, setTimeLeft] = useState(0);

    // Timer para expedición en progreso
    useEffect(() => {
        if (expedition.status === 'IN_PROGRESS' && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((t) => {
                    if (t <= 1) {
                        dispatch({ type: 'COMPLETE_EXPEDITION' });
                        return 0;
                    }
                    return t - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [expedition.status, timeLeft, dispatch]);

    const handleStartExpedition = useCallback(() => {
        if (!selectedBiome || !selectedBait) return;
        dispatch({ type: 'START_EXPEDITION', payload: { biome: selectedBiome, bait: selectedBait } });
        setTimeLeft(120); // 2 minutos
    }, [selectedBiome, selectedBait, dispatch]);

    const handleFocusAttempt = useCallback(() => {
        // El "punto perfecto" de enfoque está en 70-80%
        const isSuccess = sliderValue >= 65 && sliderValue <= 85;
        setFocusResult(isSuccess ? 'success' : 'fail');
        if (isSuccess) {
            dispatch({ type: 'UPDATE_FIELD_NOTES', payload: 1 });
        }
        setTimeout(() => {
            setFocusResult('none');
            setShowMinigame(false);
            setSliderValue(0);
        }, 2000);
    }, [sliderValue, dispatch]);

    const handleReset = useCallback(() => {
        dispatch({ type: 'RESET_EXPEDITION' });
        setSelectedBiome(null);
        setSelectedBait(null);
        setTimeLeft(0);
    }, [dispatch]);

    const formatTime = (s: number) => {
        const min = Math.floor(s / 60);
        const sec = s % 60;
        return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };

    // Accessibility descriptions for biomes
    const biomeAccessibility: Record<BiomeType, string> = {
        BOSQUE: 'Bioma Bosque — Mayor probabilidad de aves insectívoras y forestales',
        COSTA: 'Bioma Costa — Mayor probabilidad de aves acuáticas y marinas',
        MONTAÑA: 'Bioma Montaña — Mayor probabilidad de rapaces y aves de altura',
    };

    // ─── RENDERERS ─────────────────────────────────────────────

    const renderExploracion = () => {
        if (expedition.status === 'IDLE') {
            return (
                <View style={styles.tabContent}>
                    <Text style={styles.sectionHeading}>📍 Nueva Exploración</Text>
                    <Text style={styles.sectionSub}>Elige un bioma y un cebo para enviar a tu observador</Text>

                    {/* Selector de Bioma */}
                    <Text style={styles.miniLabel}>Bioma</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectorRow}>
                        {BIOMES.map((biome) => {
                            const isSelected = selectedBiome === biome.type;
                            return (
                                <TouchableOpacity
                                    key={biome.type}
                                    style={[
                                        styles.biomeCard,
                                        isSelected && { borderColor: biome.color, borderWidth: 3 },
                                    ]}
                                    onPress={() => setSelectedBiome(biome.type)}
                                >
                                    <Text style={styles.biomeIcon}>{biome.icon}</Text>
                                    {isRaining && (
                                        <Text style={{ position: 'absolute', top: 6, right: 6, fontSize: 14 }}>💧</Text>
                                    )}
                                    <Text style={[styles.biomeLabel, isSelected && { color: biome.color, fontWeight: typography.weightBold }]}>
                                        {biome.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>

                    {/* Selector de Cebo */}
                    <Text style={styles.miniLabel}>Cebo</Text>
                    <View style={styles.baitRow}>
                        {BAITS.map((bait) => {
                            const isSelected = selectedBait === bait.type;
                            return (
                                <TouchableOpacity
                                    key={bait.type}
                                    style={[
                                        styles.baitCard,
                                        isSelected && styles.baitCardSelected,
                                    ]}
                                    onPress={() => setSelectedBait(bait.type)}
                                >
                                    <Text style={styles.baitIcon}>{bait.icon}</Text>
                                    <Text style={[styles.baitLabel, isSelected && styles.baitLabelSelected]}>{bait.label}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.sendButton,
                            (!selectedBiome || !selectedBait) && styles.sendButtonDisabled,
                        ]}
                        onPress={handleStartExpedition}
                        disabled={!selectedBiome || !selectedBait}
                    >
                        <Text style={styles.sendButtonText}>🔭 Enviar Observador</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (expedition.status === 'IN_PROGRESS') {
            return (
                <View style={styles.tabContent}>
                    <Text style={styles.sectionHeading}>🔭 En Curso...</Text>
                    <GlassCard style={styles.timerCard}>
                        <Text style={styles.timerValue}>{formatTime(timeLeft)}</Text>
                        <Text style={styles.timerBiome}>
                            {BIOMES.find((b) => b.type === expedition.selectedBiome)?.icon}{' '}
                            Explorando {expedition.selectedBiome}
                        </Text>
                    </GlassCard>

                    {!showMinigame ? (
                        <TouchableOpacity style={styles.minigameButton} onPress={() => setShowMinigame(true)}>
                            <Text style={styles.minigameButtonText}>📸 Avistamiento Rápido</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.minigameZone}>
                            <Text style={styles.minigameTitle}>🔍 ¡Mantén el enfoque!</Text>
                            <View style={styles.photoZone}>
                                <Text style={[styles.photoEmoji, { opacity: 0.2 + (sliderValue / 100) * 0.8 }]}>🐦</Text>
                            </View>
                            <View style={styles.sliderControls}>
                                <TouchableOpacity style={styles.sliderBtn} onPress={() => setSliderValue(Math.max(0, sliderValue - 10))}>
                                    <Text>◀</Text>
                                </TouchableOpacity>
                                <Text style={styles.sliderValueText}>{sliderValue}%</Text>
                                <TouchableOpacity style={styles.sliderBtn} onPress={() => setSliderValue(Math.min(100, sliderValue + 10))}>
                                    <Text>▶</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={styles.shutterButton} onPress={handleFocusAttempt}>
                                <Text style={styles.shutterButtonText}>📸 ¡FOTO!</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            );
        }

        return (
            <View style={styles.tabContent}>
                <Text style={styles.sectionHeading}>✅ Completada</Text>
                <GlassCard style={styles.completedCard}>
                    <Text style={styles.completedEmoji}>🎉</Text>
                    <Text style={styles.completedText}>¡Expedición exitosa!</Text>
                </GlassCard>
                <TouchableOpacity style={styles.sendButton} onPress={handleReset}>
                    <Text style={styles.sendButtonText}>🔄 Volver</Text>
                </TouchableOpacity>
            </View>
        );
    };

    /**
     * Lógica simplificada de Taller integrada
     */
    const renderTaller = () => {
        const REQUIRED_SLOTS: { type: CraftItemType; icon: string; label: string }[] = [
            { type: 'FOTO', icon: '📸', label: 'Foto' },
            { type: 'PLUMA', icon: '🪶', label: 'Pluma' },
            { type: 'NOTAS', icon: '📝', label: 'Notas' },
        ];

        const availableItems = state.player.craftItems;
        const hasFoto = availableItems.some(i => i.type === 'FOTO');
        const hasPluma = availableItems.some(i => i.type === 'PLUMA');
        const hasNotas = availableItems.some(i => i.type === 'NOTAS');
        const canCraft = hasFoto && hasPluma && hasNotas;

        const handleCraft = () => {
            if (!canCraft) return;
            // Consume materials
            const itemFoto = availableItems.find(i => i.type === 'FOTO');
            const itemPluma = availableItems.find(i => i.type === 'PLUMA');
            const itemNotas = availableItems.find(i => i.type === 'NOTAS');

            if (itemFoto) dispatch({ type: 'REMOVE_CRAFT_ITEM', payload: itemFoto.id });
            if (itemPluma) dispatch({ type: 'REMOVE_CRAFT_ITEM', payload: itemPluma.id });
            if (itemNotas) dispatch({ type: 'REMOVE_CRAFT_ITEM', payload: itemNotas.id });

            alert('¡Ave registrada! Has obtenido una nueva carta en tu colección.');
        };

        return (
            <View style={styles.tabContent}>
                <Text style={styles.sectionHeading}>🔨 Mesa de Trabajo</Text>
                <Text style={styles.sectionSub}>Combina materiales para crear cartas de aves</Text>

                <View style={styles.craftingGrid}>
                    {REQUIRED_SLOTS.map((slot) => {
                        const hasItem = availableItems.some(i => i.type === slot.type);
                        return (
                            <View key={slot.type} style={[styles.craftSlot, hasItem && styles.craftSlotActive]}>
                                <Text style={styles.slotIcon}>{slot.icon}</Text>
                                <Text style={styles.slotLabel}>{slot.label}</Text>
                                {hasItem && (
                                    <View style={styles.checkMark}>
                                        <Text style={{ fontSize: 10, color: colors.white }}>✓</Text>
                                    </View>
                                )}
                            </View>
                        );
                    })}
                </View>

                <TouchableOpacity
                    style={[styles.sendButton, styles.workshopButton, !canCraft && styles.sendButtonDisabled]}
                    onPress={handleCraft}
                    disabled={!canCraft}
                >
                    <Text style={styles.sendButtonText}>🔨 Registrar Ave</Text>
                </TouchableOpacity>

                <View style={styles.inventoryMini}>
                    <Text style={styles.miniLabel}>Tus Materiales ({availableItems.length})</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }}>
                        {availableItems.map(item => (
                            <View key={item.id} style={styles.invChip}>
                                <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                            </View>
                        ))}
                        {availableItems.length === 0 && (
                            <Text style={{ fontSize: 12, opacity: 0.4 }}>No tienes materiales aún</Text>
                        )}
                    </ScrollView>
                </View>
            </View>
        );
    };

    /**
     * Lógica simplificada de Cooperación integrada
     */
    const renderCoop = () => {
        const { invitations, trainingSessions } = coop.state;
        const pendingInvs = invitations.filter(inv => inv.status === 'PENDING');

        return (
            <View style={styles.tabContent}>
                <Text style={styles.sectionHeading}>👥 Comunidad</Text>
                <Text style={styles.sectionSub}>Colabora con otros naturalistas</Text>

                <View style={styles.coopSection}>
                    <Text style={styles.miniLabel}>Invitaciones Pendientes ({pendingInvs.length})</Text>
                    {pendingInvs.map(inv => (
                        <GlassCard key={inv.id} style={styles.invMiniCard}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.invFrom}>{inv.fromPlayerName}</Text>
                                    <Text style={styles.invMsg}>{inv.message}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', gap: spacing.xs }}>
                                    <TouchableOpacity
                                        style={[styles.smallBtn, { backgroundColor: colors.primary }]}
                                        onPress={() => coop.acceptInvitation(inv.id)}
                                    >
                                        <Text style={styles.smallBtnText}>✓</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.smallBtn, { backgroundColor: colors.error }]}
                                        onPress={() => coop.declineInvitation(inv.id)}
                                    >
                                        <Text style={styles.smallBtnText}>✕</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </GlassCard>
                    ))}
                    {pendingInvs.length === 0 && (
                        <Text style={{ fontSize: 12, opacity: 0.4, textAlign: 'center', marginVertical: spacing.md }}>
                            No tienes invitaciones nuevas
                        </Text>
                    )}

                    <Text style={[styles.miniLabel, { marginTop: spacing.md }]}>Sesiones de Entrenamiento</Text>
                    {trainingSessions.map(sess => (
                        <View key={sess.id} style={styles.trainingItem}>
                            <View style={{ flex: 1, gap: 4 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 13 }}>
                                    {sess.birdCard.photo} {sess.birdCard.name}
                                </Text>
                                <View style={styles.progressBar}>
                                    <View style={{ width: `${sess.progress}%`, height: 4, backgroundColor: colors.primary }} />
                                </View>
                                <Text style={{ fontSize: 10, opacity: 0.6 }}>Progreso: {sess.progress}%</Text>
                            </View>
                            <TouchableOpacity
                                style={[styles.smallBtn, { backgroundColor: colors.secondary, width: 80 }]}
                                onPress={() => coop.boostTraining(sess.id)}
                            >
                                <Text style={styles.smallBtnText}>¡ANIMAR!</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <style>{expedicionAnimCSS}</style>

            {/* Cabecero Unificado con Tabs */}
            <View style={styles.header}>
                <Text style={styles.mainTitle}>🗺️ Expedición</Text>
                <View style={styles.tabBar}>
                    {SUB_TABS.map(tab => (
                        <TouchableOpacity
                            key={tab.id}
                            style={[styles.tabItem, activeSubTab === tab.id && styles.tabItemActive]}
                            onPress={() => setActiveSubTab(tab.id)}
                        >
                            <Text style={styles.tabIcon}>{tab.icon}</Text>
                            {activeSubTab === tab.id && <Text style={styles.tabLabel}>{tab.label}</Text>}
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollRoot}>
                {activeSubTab === 'EXPLORA' && renderExploracion()}
                {activeSubTab === 'TALLER' && renderTaller()}
                {activeSubTab === 'COOP' && renderCoop()}
            </ScrollView>

            {/* Global Resources Bar */}
            <View style={styles.globalResources}>
                <ResourceCounter icon="🌰" value={state.player.resources.seeds} />
                <ResourceCounter icon="📝" value={state.player.resources.fieldNotes} />
                <ResourceCounter icon="⭐" value={state.player.reputation} />
            </View>
        </View>
    );
}

// ─── ESTILOS ─────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollRoot: {
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.huge,
    },
    header: {
        paddingTop: 48,
        paddingBottom: spacing.lg,
        paddingHorizontal: spacing.xl,
        backgroundColor: colors.background,
        gap: spacing.md,
    },
    mainTitle: {
        fontSize: typography.sizeTitle,
        fontWeight: typography.weightBold,
        color: colors.text,
        fontFamily: typography.fontTitle,
    },
    tabBar: {
        flexDirection: 'row',
        gap: spacing.sm,
        backgroundColor: 'rgba(124, 154, 146, 0.08)',
        borderRadius: borders.radiusFull,
        padding: 4,
    },
    tabItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: spacing.lg,
        borderRadius: borders.radiusFull,
        gap: spacing.xs,
    },
    tabItemActive: {
        backgroundColor: colors.primary,
        ...shadows.card,
    },
    tabIcon: {
        fontSize: 16,
    },
    tabLabel: {
        fontSize: 12,
        fontWeight: typography.weightBold,
        color: colors.white,
        fontFamily: typography.fontBody,
    },
    tabContent: {
        paddingTop: spacing.md,
    },
    sectionHeading: {
        fontSize: typography.sizeSubtitle,
        fontWeight: typography.weightBold,
        color: colors.text,
        fontFamily: typography.fontTitle,
        marginBottom: 2,
    },
    sectionSub: {
        fontSize: 11,
        color: colors.text,
        opacity: 0.6,
        marginBottom: spacing.xl,
    },
    miniLabel: {
        fontSize: 10,
        fontWeight: typography.weightBold,
        color: colors.primary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: spacing.sm,
    },
    selectorRow: {
        paddingBottom: spacing.lg,
        gap: spacing.md,
    },
    biomeCard: {
        backgroundColor: colors.glass,
        borderRadius: borders.radiusLarge,
        padding: spacing.md,
        alignItems: 'center',
        width: 100,
        borderWidth: 1,
        borderColor: colors.glassBorder,
    },
    biomeIcon: {
        fontSize: 32,
        marginBottom: 4,
    },
    biomeLabel: {
        fontSize: 11,
        color: colors.text,
    },
    baitRow: {
        flexDirection: 'row',
        gap: spacing.md,
        marginBottom: spacing.xxl,
    },
    baitCard: {
        flex: 1,
        backgroundColor: colors.glass,
        borderRadius: borders.radiusMedium,
        padding: spacing.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.glassBorder,
    },
    baitCardSelected: {
        backgroundColor: 'rgba(217, 160, 139, 0.15)',
        borderColor: colors.secondary,
    },
    baitIcon: {
        fontSize: 24,
    },
    baitLabel: {
        fontSize: 10,
        marginTop: 2,
    },
    baitLabelSelected: {
        fontWeight: typography.weightBold,
        color: colors.secondaryDark,
    },
    sendButton: {
        backgroundColor: colors.primary,
        borderRadius: borders.radiusFull,
        paddingVertical: spacing.lg,
        alignItems: 'center',
        ...shadows.card,
    },
    sendButtonText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: typography.weightBold,
    },
    sendButtonDisabled: {
        backgroundColor: colors.disabled,
        opacity: 0.5,
    },
    timerCard: {
        alignItems: 'center',
        paddingVertical: spacing.xl,
        marginBottom: spacing.lg,
    },
    timerValue: {
        fontSize: 48,
        fontWeight: typography.weightBold,
        color: colors.primary,
        fontFamily: typography.fontTitle,
    },
    timerBiome: {
        fontSize: 12,
        opacity: 0.6,
    },
    minigameButton: {
        backgroundColor: colors.secondary,
        padding: spacing.lg,
        borderRadius: borders.radiusLarge,
        alignItems: 'center',
    },
    minigameButtonText: {
        color: colors.white,
        fontWeight: 'bold',
    },
    minigameZone: {
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: borders.radiusLarge,
        padding: spacing.lg,
        alignItems: 'center',
        gap: spacing.md,
    },
    minigameTitle: {
        fontSize: 14,
        fontWeight: typography.weightBold,
        color: colors.primary,
    },
    photoZone: {
        width: 160,
        height: 160,
        backgroundColor: colors.white,
        borderRadius: 80,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 4,
        borderColor: colors.primary,
    },
    photoEmoji: {
        fontSize: 80,
    },
    sliderControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xl,
    },
    sliderBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.card,
    },
    sliderValueText: {
        fontSize: 18,
        fontWeight: typography.weightBold,
        width: 60,
        textAlign: 'center',
    },
    shutterButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.xxl,
        paddingVertical: spacing.md,
        borderRadius: borders.radiusFull,
        ...shadows.card,
    },
    shutterButtonText: {
        color: colors.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    // Crafting Styles
    craftingGrid: {
        flexDirection: 'row',
        gap: spacing.md,
        marginBottom: spacing.xl,
    },
    craftSlot: {
        flex: 1,
        aspectRatio: 1,
        backgroundColor: 'rgba(124, 154, 146, 0.05)',
        borderRadius: borders.radiusMedium,
        borderWidth: 2,
        borderColor: colors.glassBorder,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
    },
    craftSlotActive: {
        borderStyle: 'solid',
        borderColor: colors.primary,
        backgroundColor: 'rgba(124, 154, 146, 0.1)',
    },
    slotIcon: { fontSize: 24 },
    slotLabel: { fontSize: 10, opacity: 0.6 },
    checkMark: {
        position: 'absolute',
        top: -4,
        right: -4,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    workshopButton: {
        backgroundColor: colors.primaryDark,
        marginBottom: spacing.xl,
    },
    inventoryMini: {
        marginTop: spacing.md,
    },
    invChip: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.glass,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm,
        borderWidth: 1,
        borderColor: colors.glassBorder,
    },
    // Coop Styles
    coopSection: {
        gap: spacing.md,
    },
    invMiniCard: {
        padding: spacing.md,
        gap: 2,
    },
    invFrom: { fontWeight: 'bold', fontSize: 13 },
    invMsg: { fontSize: 11, opacity: 0.7, fontStyle: 'italic' },
    trainingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        padding: spacing.sm,
        backgroundColor: 'rgba(0,0,0,0.03)',
        borderRadius: 8,
    },
    progressBar: {
        flex: 1,
        height: 6,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    smallBtn: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 6,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 32,
    },
    smallBtnText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: 'bold',
    },
    globalResources: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacing.xl,
        paddingVertical: spacing.md,
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    completedCard: {
        alignItems: 'center',
        paddingVertical: spacing.xxl,
        marginBottom: spacing.xl,
    },
    completedEmoji: { fontSize: 64 },
    completedText: { fontWeight: 'bold' },
});
