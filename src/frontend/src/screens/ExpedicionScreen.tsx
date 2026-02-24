import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { GlassCard } from '../components/GlassCard';
import { ResourceCounter } from '../components/ResourceCounter';
import { useGame } from '../context/GameContext';
import { BiomeType, BaitType } from '../types/types';
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

/**
 * Pantalla de Expedición
 * Objetivo: Exploración y obtención de materiales.
 * - Estado A: Elegir bioma + cebo → Enviar Observador
 * - Estado B: Temporizador + minijuego de Enfoque
 */
export function ExpedicionScreen() {
    const { state, dispatch } = useGame();
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

    // ─── ESTADO A: Seleccionar bioma y cebo ─────────────────
    if (expedition.status === 'IDLE') {
        return (
            <View style={styles.container}>
                <style>{expedicionAnimCSS}</style>
                <Text style={styles.title}>🗺️ Expedición</Text>
                <Text style={styles.subtitle}>Elige un bioma y un cebo para enviar a tu observador</Text>

                {/* Selector de Bioma */}
                <Text style={styles.sectionTitle}>Bioma</Text>
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
                                accessibilityLabel={biomeAccessibility[biome.type]}
                                accessibilityRole="radio"
                                accessibilityState={{ selected: isSelected }}
                            >
                                <Text style={styles.biomeIcon}>{biome.icon}</Text>
                                {isRaining && (
                                    <div style={{ position: 'absolute', top: 6, right: 6, animation: 'rainDropBiome 1s ease-in-out infinite', fontSize: 14 }}>💧</div>
                                )}
                                <Text style={[styles.biomeLabel, isSelected && { color: biome.color, fontWeight: typography.weightBold }]}>
                                    {biome.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                {/* Selector de Cebo */}
                <Text style={styles.sectionTitle}>Cebo</Text>
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
                                accessibilityLabel={`Cebo ${bait.label}. Atrae aves según su dieta`}
                                accessibilityRole="radio"
                                accessibilityState={{ selected: isSelected }}
                            >
                                <Text style={styles.baitIcon}>{bait.icon}</Text>
                                <Text style={[styles.baitLabel, isSelected && styles.baitLabelSelected]}>{bait.label}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Botón Enviar — brilla en dorado si tiene Notas de Campo */}
                <div style={hasFieldNotes && selectedBiome && selectedBait ? {
                    animation: 'goldenPulse 2s ease-in-out infinite',
                    borderRadius: 999,
                    alignSelf: 'center',
                } : { alignSelf: 'center' }}>
                    <TouchableOpacity
                        style={[
                            styles.sendButton,
                            (!selectedBiome || !selectedBait) && styles.sendButtonDisabled,
                            hasFieldNotes && selectedBiome && selectedBait && styles.sendButtonGolden,
                        ]}
                        onPress={handleStartExpedition}
                        disabled={!selectedBiome || !selectedBait}
                        accessibilityLabel={`Enviar observador${hasFieldNotes ? '. Tienes Notas de Campo — mayor probabilidad de éxito' : ''}`}
                    >
                        <Text style={styles.sendButtonText}>
                            {hasFieldNotes ? '✨ ' : ''}🔭 Enviar Observador
                        </Text>
                        {hasFieldNotes && (
                            <Text style={styles.goldenHint}>Notas de Campo activas — más suerte</Text>
                        )}
                    </TouchableOpacity>
                </div>

                {/* Recursos actuales */}
                <View style={styles.resourceBar}>
                    <ResourceCounter icon="📝" value={state.player.resources.fieldNotes} label="Notas" />
                    <ResourceCounter icon="🌰" value={state.player.resources.seeds} label="Semillas" />
                </View>
            </View>
        );
    }

    // ─── ESTADO B: Expedición en progreso / Minijuego ───────
    if (expedition.status === 'IN_PROGRESS') {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>🔭 Expedición en Curso</Text>

                <GlassCard style={styles.timerCard}>
                    <Text style={styles.timerLabel}>⏱️ Tiempo restante</Text>
                    <Text style={styles.timerValue}>{formatTime(timeLeft)}</Text>
                    <Text style={styles.timerBiome}>
                        {BIOMES.find((b) => b.type === expedition.selectedBiome)?.icon}{' '}
                        {expedition.selectedBiome} — Cebo: {BAITS.find((b) => b.type === expedition.selectedBait)?.icon}
                    </Text>
                </GlassCard>

                {/* Minijuego de Enfoque */}
                {!showMinigame ? (
                    <TouchableOpacity
                        style={styles.minigameButton}
                        onPress={() => setShowMinigame(true)}
                        accessibilityLabel="Realizar avistamiento rápido para ganar notas de campo"
                    >
                        <Text style={styles.minigameButtonText}>📸 Realizar Avistamiento Rápido</Text>
                        <Text style={styles.minigameHint}>¡Gana Notas de Campo extra!</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.minigameOverlay}>
                        <Text style={styles.minigameTitle}>🔍 Minijuego de Enfoque</Text>
                        <Text style={styles.minigameInstruction}>
                            Mueve el marcador hasta enfocar la imagen (zona verde ≈ 70-80%)
                        </Text>

                        {/* Zona de la "foto" con blur simulado */}
                        <View style={styles.photoZone}>
                            <Text style={[
                                styles.photoEmoji,
                                { opacity: 0.2 + (sliderValue / 100) * 0.8 },
                            ]}>
                                🐦
                            </Text>
                            <Text style={[
                                styles.photoText,
                                { opacity: sliderValue > 60 && sliderValue < 90 ? 1 : 0.3 },
                            ]}>
                                {sliderValue > 60 && sliderValue < 90 ? '¡Bien enfocado!' : 'Borroso...'}
                            </Text>
                        </View>

                        {/* Slider simulado con botones */}
                        <View style={styles.sliderContainer}>
                            <View style={styles.sliderTrack}>
                                <View style={[styles.sliderFill, { width: `${sliderValue}%` as any }]} />
                                <View style={[styles.sweetSpot, { left: '65%' as any, width: '20%' as any }]} />
                            </View>
                            <View style={styles.sliderButtons}>
                                <TouchableOpacity
                                    style={styles.sliderBtn}
                                    onPress={() => setSliderValue(Math.max(0, sliderValue - 10))}
                                    accessibilityLabel="Desenfocar"
                                >
                                    <Text style={styles.sliderBtnText}>◀ −</Text>
                                </TouchableOpacity>
                                <Text style={styles.sliderPercent}>{sliderValue}%</Text>
                                <TouchableOpacity
                                    style={styles.sliderBtn}
                                    onPress={() => setSliderValue(Math.min(100, sliderValue + 10))}
                                    accessibilityLabel="Enfocar más"
                                >
                                    <Text style={styles.sliderBtnText}>+ ▶</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Botón de disparo */}
                        <TouchableOpacity style={styles.shutterButton} onPress={handleFocusAttempt}>
                            <Text style={styles.shutterButtonText}>📸 ¡Capturar!</Text>
                        </TouchableOpacity>

                        {/* Flash de cámara en éxito */}
                        {focusResult === 'success' && (
                            <div style={{
                                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                                backgroundColor: 'white',
                                animation: 'cameraFlash 0.6s ease-out forwards',
                                zIndex: 999,
                                pointerEvents: 'none',
                            }} />
                        )}

                        {/* Resultado */}
                        {focusResult !== 'none' && (
                            <GlassCard style={focusResult === 'success' ? styles.resultSuccess : styles.resultFail}>
                                <Text style={styles.resultText}>
                                    {focusResult === 'success'
                                        ? '📸 ¡Foto perfecta! +1 Nota de Campo'
                                        : '❌ Imagen borrosa... ¡Inténtalo de nuevo!'}
                                </Text>
                            </GlassCard>
                        )}
                    </View>
                )}
            </View>
        );
    }

    // ─── ESTADO C: Expedición completada ────────────────────
    return (
        <View style={styles.container}>
            <Text style={styles.title}>✅ ¡Expedición Completada!</Text>
            <GlassCard style={styles.completedCard}>
                <Text style={styles.completedEmoji}>🎉</Text>
                <Text style={styles.completedText}>
                    Has recolectado materiales del bioma{' '}
                    {BIOMES.find((b) => b.type === expedition.selectedBiome)?.label}
                </Text>
                <Text style={styles.completedHint}>
                    Ve al Taller para construir tu Estación de Reclamo
                </Text>
            </GlassCard>
            <TouchableOpacity style={styles.sendButton} onPress={handleReset}>
                <Text style={styles.sendButtonText}>🔄 Nueva Expedición</Text>
            </TouchableOpacity>
        </View>
    );
}

// ─── ESTILOS ─────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: 48,
        paddingHorizontal: spacing.xl,
    },
    title: {
        fontSize: typography.sizeTitle,
        fontWeight: typography.weightBold,
        color: colors.text,
        textAlign: 'center',
        fontFamily: typography.fontTitle,
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: typography.sizeBody,
        color: colors.text,
        opacity: 0.7,
        textAlign: 'center',
        marginBottom: spacing.xxl,
        fontFamily: typography.fontBody,
    },
    sectionTitle: {
        fontSize: typography.sizeSubtitle,
        fontWeight: typography.weightSemiBold,
        color: colors.text,
        marginBottom: spacing.md,
        fontFamily: typography.fontBody,
    },

    // Biome Selector
    selectorRow: {
        paddingBottom: spacing.xl,
        gap: spacing.md,
    },
    biomeCard: {
        backgroundColor: colors.glass,
        borderRadius: borders.radiusLarge,
        padding: spacing.lg,
        alignItems: 'center',
        width: 110,
        borderWidth: 2,
        borderColor: 'transparent',
        ...shadows.card,
        //@ts-ignore
        backdropFilter: 'blur(10px)',
    },
    biomeIcon: {
        fontSize: 48,
        marginBottom: spacing.sm,
    },
    rainIndicator: {
        position: 'absolute',
        top: 8,
        right: 8,
        fontSize: 16,
    },
    biomeLabel: {
        fontSize: typography.sizeCaption,
        color: colors.text,
        fontFamily: typography.fontBody,
    },

    // Bait Selector
    baitRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacing.lg,
        marginBottom: spacing.xxl,
    },
    baitCard: {
        backgroundColor: colors.glass,
        borderRadius: borders.radiusFull,
        padding: spacing.lg,
        alignItems: 'center',
        width: 90,
        height: 90,
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
        ...shadows.card,
    },
    baitCardSelected: {
        borderColor: colors.secondary,
        backgroundColor: colors.secondaryLight,
    },
    baitIcon: {
        fontSize: 32,
    },
    baitLabel: {
        fontSize: typography.sizeSmall,
        color: colors.text,
        marginTop: spacing.xs,
        fontFamily: typography.fontBody,
    },
    baitLabelSelected: {
        fontWeight: typography.weightBold,
        color: colors.secondaryDark,
    },

    // Send Button
    sendButton: {
        backgroundColor: colors.primary,
        borderRadius: borders.radiusFull,
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.xxl,
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: spacing.xl,
        ...shadows.glass,
    },
    sendButtonGolden: {
        backgroundColor: '#FF8F00',
    },
    sendButtonDisabled: {
        backgroundColor: colors.disabled,
    },
    goldenHint: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: typography.sizeSmall,
        marginTop: spacing.xs,
        fontStyle: 'italic',
    },
    sendButtonText: {
        color: colors.white,
        fontSize: typography.sizeSubtitle,
        fontWeight: typography.weightBold,
        fontFamily: typography.fontBody,
    },

    // Resources
    resourceBar: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacing.lg,
        marginTop: spacing.lg,
    },

    // Timer
    timerCard: {
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.xxl,
    },
    timerLabel: {
        fontSize: typography.sizeBody,
        color: colors.text,
        fontFamily: typography.fontBody,
    },
    timerValue: {
        fontSize: typography.sizeHero,
        fontWeight: typography.weightBold,
        color: colors.primary,
        fontFamily: typography.fontTitle,
    },
    timerBiome: {
        fontSize: typography.sizeCaption,
        color: colors.text,
        opacity: 0.6,
    },

    // Minigame Button
    minigameButton: {
        backgroundColor: colors.secondary,
        borderRadius: borders.radiusLarge,
        padding: spacing.xl,
        alignItems: 'center',
        ...shadows.glass,
        marginBottom: spacing.xl,
    },
    minigameButtonText: {
        color: colors.white,
        fontSize: typography.sizeSubtitle,
        fontWeight: typography.weightBold,
        fontFamily: typography.fontBody,
    },
    minigameHint: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: typography.sizeCaption,
        marginTop: spacing.xs,
    },

    // Minigame Overlay
    minigameOverlay: {
        flex: 1,
        gap: spacing.lg,
    },
    minigameTitle: {
        fontSize: typography.sizeSubtitle,
        fontWeight: typography.weightBold,
        color: colors.text,
        textAlign: 'center',
        fontFamily: typography.fontTitle,
    },
    minigameInstruction: {
        fontSize: typography.sizeCaption,
        color: colors.text,
        opacity: 0.7,
        textAlign: 'center',
        fontFamily: typography.fontBody,
    },

    // Photo Zone
    photoZone: {
        height: 160,
        backgroundColor: colors.primaryLight,
        borderRadius: borders.radiusLarge,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    photoEmoji: {
        fontSize: 80,
    },
    photoText: {
        fontSize: typography.sizeCaption,
        color: colors.text,
        fontWeight: typography.weightBold,
        marginTop: spacing.xs,
    },

    // Slider
    sliderContainer: {
        gap: spacing.md,
    },
    sliderTrack: {
        height: 12,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: borders.radiusFull,
        overflow: 'hidden',
        position: 'relative',
    },
    sliderFill: {
        height: '100%' as any,
        backgroundColor: colors.primary,
        borderRadius: borders.radiusFull,
    },
    sweetSpot: {
        position: 'absolute',
        top: 0,
        height: '100%' as any,
        backgroundColor: 'rgba(39, 174, 96, 0.3)',
        borderRadius: borders.radiusFull,
    },
    sliderButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing.xl,
    },
    sliderBtn: {
        backgroundColor: colors.glass,
        borderRadius: borders.radiusFull,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        ...shadows.card,
    },
    sliderBtnText: {
        fontSize: typography.sizeBody,
        fontWeight: typography.weightBold,
        color: colors.text,
    },
    sliderPercent: {
        fontSize: typography.sizeSubtitle,
        fontWeight: typography.weightBold,
        color: colors.primary,
    },

    // Shutter
    shutterButton: {
        backgroundColor: colors.canto,
        borderRadius: borders.radiusFull,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xxl,
        alignSelf: 'center',
        ...shadows.glass,
    },
    shutterButtonText: {
        color: colors.white,
        fontSize: typography.sizeBody,
        fontWeight: typography.weightBold,
    },

    // Result
    resultSuccess: {
        backgroundColor: 'rgba(39, 174, 96, 0.2)',
        borderColor: colors.success,
    },
    resultFail: {
        backgroundColor: 'rgba(231, 76, 60, 0.2)',
        borderColor: colors.error,
    },
    resultText: {
        fontSize: typography.sizeBody,
        fontWeight: typography.weightSemiBold,
        color: colors.text,
        textAlign: 'center',
        fontFamily: typography.fontBody,
    },

    // Completed
    completedCard: {
        alignItems: 'center',
        gap: spacing.md,
        marginBottom: spacing.xxl,
    },
    completedEmoji: {
        fontSize: 64,
    },
    completedText: {
        fontSize: typography.sizeBody,
        color: colors.text,
        textAlign: 'center',
        fontFamily: typography.fontBody,
    },
    completedHint: {
        fontSize: typography.sizeCaption,
        color: colors.primaryDark,
        fontStyle: 'italic',
        textAlign: 'center',
        fontFamily: typography.fontBody,
    },
});
