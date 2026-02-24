import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { GlassCard } from '../components/GlassCard';
import { useGame } from '../context/GameContext';
import { BirdCard, PostureType, DuelResult } from '../types/types';
import { colors, typography, spacing, borders, shadows } from '../theme/theme';

// CSS animations for Certamen effects
const certamenAnimCSS = `
@keyframes clashFlash {
  0%   { opacity: 0; transform: scale(0.5); }
  30%  { opacity: 1; transform: scale(1.3); }
  100% { opacity: 0; transform: scale(2); }
}
@keyframes repBarPulse {
  0%, 100% { box-shadow: 0 0 5px rgba(39,174,96,0.2); }
  50%      { box-shadow: 0 0 15px rgba(39,174,96,0.5); }
}
@keyframes windLock {
  0%, 100% { transform: rotate(-5deg); }
  50%      { transform: rotate(5deg); }
}
@keyframes tipSlide {
  0%   { transform: translateY(10px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
`;

// ─── CONFIGURACIÓN DE POSTURAS ─────────────────────────────
const POSTURES: {
    type: PostureType;
    icon: string;
    label: string;
    color: string;
    beats: PostureType;
    beatsLabel: string;
}[] = [
        { type: 'CANTO', icon: '🎤', label: 'Canto', color: colors.canto, beats: 'PLUMAJE', beatsLabel: 'Plumaje' },
        { type: 'PLUMAJE', icon: '🪶', label: 'Plumaje', color: colors.plumaje, beats: 'VUELO', beatsLabel: 'Vuelo' },
        { type: 'VUELO', icon: '💨', label: 'Vuelo', color: colors.vuelo, beats: 'CANTO', beatsLabel: 'Canto' },
    ];

// Rival mock
const RIVAL_BIRDS: BirdCard[] = [
    {
        id: 'rival-1',
        name: 'Búho Real',
        photo: 'https://picsum.photos/seed/owl/300/400',
        cost: 3,
        preferredPosture: 'VUELO',
        passiveAbility: 'De noche, gana +2 en Ataque',
        stats: { attack: 7, defense: 6, speed: 5 },
        scientificName: 'Bubo bubo',
        habitat: 'MONTAÑA',
        curiosity: '',
    },
];

function resolvePostureDuel(player: PostureType, rival: PostureType): DuelResult {
    if (player === rival) return 'DRAW';
    const playerPosture = POSTURES.find((p) => p.type === player)!;
    return playerPosture.beats === rival ? 'WIN' : 'LOSE';
}

// Generar consejo del rival tras perder
function generateRivalTip(playerBird: BirdCard | null, rivalPosture: PostureType | null): string {
    const tips = [
        `Tu pájaro es lento. Busca especies de Montaña en las Expediciones.`,
        `Intenta usar Canto contra mi Plumaje la próxima vez.`,
        `Necesitas un ave con más ATK. ¡Craftea en el Taller!`,
        `El viento afecta al Vuelo. Usa Canto o Plumaje cuando haya viento.`,
        `Las aves de Costa tienen buen equilibrio. ¡Explora ese bioma!`,
    ];
    return tips[Math.floor(Math.random() * tips.length)];
}

/**
 * Pantalla del Certamen (Batalla 1v1)
 * Sistema de Posturas: Canto > Plumaje > Vuelo > Canto
 * - Seleccionar un ave de tu colección
 * - Elegir postura para el duelo
 * - Resolución con animación
 */
export function CertamenScreen() {
    const { state, dispatch } = useGame();
    const { player, weather } = state;

    const [phase, setPhase] = useState<'SELECT_BIRD' | 'BATTLE' | 'RESULT'>('SELECT_BIRD');
    const [selectedBird, setSelectedBird] = useState<BirdCard | null>(null);
    const [rivalBird] = useState<BirdCard>(RIVAL_BIRDS[0]);
    const [turn, setTurn] = useState(1);
    const [playerRep, setPlayerRep] = useState(0);
    const [rivalRep, setRivalRep] = useState(0);
    const [lastResult, setLastResult] = useState<DuelResult | null>(null);
    const [chosenPosture, setChosenPosture] = useState<PostureType | null>(null);
    const [rivalPosture, setRivalPosture] = useState<PostureType | null>(null);
    const [rivalTip, setRivalTip] = useState<string | null>(null);

    const mana = turn; // Mana = turno actual
    const windActive = weather.condition === 'VIENTO';

    // Aves disponibles (coste <= mana)
    const affordableBirds = useMemo(() =>
        player.collection.filter((b) => b.cost <= mana),
        [player.collection, mana]
    );

    const handleSelectBird = useCallback((bird: BirdCard) => {
        setSelectedBird(bird);
        setPhase('BATTLE');
    }, []);

    const handleChoosePosture = useCallback((posture: PostureType) => {
        // Rival elige aleatoriamente
        const rivalChoice = POSTURES[Math.floor(Math.random() * 3)].type;
        setChosenPosture(posture);
        setRivalPosture(rivalChoice);

        const result = resolvePostureDuel(posture, rivalChoice);
        setLastResult(result);

        // Actualizar puntuación
        if (result === 'WIN') {
            setPlayerRep((r) => r + 2);
            dispatch({ type: 'UPDATE_SEEDS', payload: 5 });
            setRivalTip(null);
        } else if (result === 'LOSE') {
            setRivalRep((r) => r + 2);
            // Consejo del rival tras perder
            setRivalTip(generateRivalTip(selectedBird, rivalChoice));
        } else {
            setRivalTip(null);
        }

        // Después de un duelo, pasar a resultado
        setTimeout(() => {
            setPhase('RESULT');
        }, 1500);
    }, [dispatch, selectedBird]);

    const handleNextRound = useCallback(() => {
        setTurn((t) => t + 1);
        setSelectedBird(null);
        setChosenPosture(null);
        setRivalPosture(null);
        setLastResult(null);
        setRivalTip(null);
        setPhase('SELECT_BIRD');
    }, []);

    const handleEndBattle = useCallback(() => {
        if (playerRep > rivalRep) {
            dispatch({ type: 'UPDATE_SEEDS', payload: 20 });
        }
        // Reset
        setTurn(1);
        setPlayerRep(0);
        setRivalRep(0);
        setSelectedBird(null);
        setChosenPosture(null);
        setRivalPosture(null);
        setLastResult(null);
        setPhase('SELECT_BIRD');
    }, [playerRep, rivalRep, dispatch]);

    // ─── FASE 1: Seleccionar Ave ───────────────────────────
    if (phase === 'SELECT_BIRD') {
        const maxRep = Math.max(playerRep + rivalRep, 1);
        return (
            <View style={styles.container}>
                <style>{certamenAnimCSS}</style>
                <View style={styles.header}>
                    <Text style={styles.title}>⚔️ El Certamen</Text>
                    <View style={styles.scoreBoard}>
                        <GlassCard style={styles.scoreCard}>
                            <Text style={styles.scoreLabel}>Tú</Text>
                            <Text style={styles.scoreValue}>{playerRep}</Text>
                        </GlassCard>
                        <Text style={styles.vs}>VS</Text>
                        <GlassCard style={styles.scoreCard}>
                            <Text style={styles.scoreLabel}>Rival</Text>
                            <Text style={styles.scoreValue}>{rivalRep}</Text>
                        </GlassCard>
                    </View>

                    {/* Barra de reputación animada */}
                    <View style={styles.repBarContainer}>
                        <div style={{
                            height: 6, borderRadius: 3,
                            width: `${(playerRep / maxRep) * 100}%`,
                            background: 'linear-gradient(90deg, #27AE60, #2ECC71)',
                            transition: 'width 0.5s ease',
                            animation: playerRep > 0 ? 'repBarPulse 2s ease-in-out infinite' : 'none',
                        }} />
                    </View>

                    <Text style={styles.turnInfo}>
                        Turno {turn} — 🌰 Mana: {mana}
                        {windActive && '  💨 ¡Viento activo!'}
                    </Text>
                </View>

                <Text style={styles.sectionTitle}>Elige un ave para el duelo:</Text>
                <ScrollView contentContainerStyle={styles.birdGrid}>
                    {affordableBirds.length === 0 ? (
                        <Text style={styles.noBirds}>No tienes aves con coste ≤ {mana} 🌰</Text>
                    ) : (
                        affordableBirds.map((bird) => (
                            <TouchableOpacity
                                key={bird.id}
                                style={styles.birdOption}
                                onPress={() => handleSelectBird(bird)}
                                accessibilityLabel={`Seleccionar ${bird.name}. Coste: ${bird.cost} semillas. Postura preferida: ${bird.preferredPosture}. ATK ${bird.stats.attack} DEF ${bird.stats.defense} VEL ${bird.stats.speed}`}
                                accessibilityRole="button"
                            >
                                <Image source={{ uri: bird.photo }} style={styles.birdPhoto} />
                                <View style={styles.birdOptionInfo}>
                                    <Text style={styles.birdOptionName}>{bird.name}</Text>
                                    <Text style={styles.birdOptionCost}>🌰 {bird.cost}</Text>
                                    <Text style={styles.birdOptionPosture}>
                                        {POSTURES.find((p) => p.type === bird.preferredPosture)?.icon}{' '}
                                        {bird.preferredPosture}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
                </ScrollView>

                {turn > 3 && (
                    <TouchableOpacity style={styles.endButton} onPress={handleEndBattle}>
                        <Text style={styles.endButtonText}>🏁 Terminar Certamen</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    }

    // ─── FASE 2: Duelo de Posturas ─────────────────────────
    if (phase === 'BATTLE') {
        return (
            <View style={styles.container}>
                {/* Rival */}
                <GlassCard style={styles.rivalZone}>
                    <Text style={styles.rivalName}>🤖 {rivalBird.name}</Text>
                    <Text style={styles.rivalStats}>
                        ATK:{rivalBird.stats.attack} DEF:{rivalBird.stats.defense} VEL:{rivalBird.stats.speed}
                    </Text>
                    {rivalPosture && (
                        <Text style={styles.rivalPosture}>
                            Postura: {POSTURES.find((p) => p.type === rivalPosture)?.icon} {rivalPosture}
                        </Text>
                    )}
                </GlassCard>

                {/* Zona Central — Posturas */}
                <View style={styles.battleCenter}>
                    <Text style={styles.battleTitle}>¡Elige tu Postura!</Text>

                    {/* Triángulo de Poder (flechas de ayuda) */}
                    <View style={styles.triangleInfo}>
                        <Text style={styles.triangleText}>🎤 Canto → vence a 🪶 Plumaje</Text>
                        <Text style={styles.triangleText}>🪶 Plumaje → vence a 💨 Vuelo</Text>
                        <Text style={styles.triangleText}>💨 Vuelo → vence a 🎤 Canto</Text>
                    </View>

                    {/* Botones de Postura */}
                    <View style={styles.postureRow}>
                        {POSTURES.map((posture) => {
                            const isWindBlocked = posture.type === 'VUELO' && windActive;
                            return (
                                <TouchableOpacity
                                    key={posture.type}
                                    style={[
                                        styles.postureButton,
                                        { backgroundColor: posture.color },
                                        isWindBlocked && styles.postureBlocked,
                                        chosenPosture === posture.type && styles.postureChosen,
                                    ]}
                                    onPress={() => !isWindBlocked && handleChoosePosture(posture.type)}
                                    disabled={!!chosenPosture || isWindBlocked}
                                    accessibilityLabel={`Usar ${posture.label}. Fuerte contra ${posture.beatsLabel}${isWindBlocked ? '. Bloqueado por viento' : ''}. Coste: ${isWindBlocked ? 'necesita calma' : 'gratis'}`}
                                >
                                    <Text style={styles.postureIcon}>{posture.icon}</Text>
                                    <Text style={styles.postureLabel}>{posture.label}</Text>
                                    <Text style={styles.postureHelp}>› {posture.beatsLabel}</Text>
                                    {isWindBlocked && (
                                        <div style={{ position: 'absolute', top: 4, right: 4, animation: 'windLock 1s ease-in-out infinite', fontSize: 16, opacity: 0.8 }}>
                                            🔒
                                        </div>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Resultado del duelo */}
                    {lastResult && (
                        <GlassCard style={[
                            styles.duelResult,
                            lastResult === 'WIN' && styles.duelWin,
                            lastResult === 'LOSE' && styles.duelLose,
                            lastResult === 'DRAW' && styles.duelDraw,
                        ]}>
                            <Text style={styles.duelResultText}>
                                {lastResult === 'WIN' && '🎉 ¡Victoria! El rival huye.'}
                                {lastResult === 'LOSE' && '💔 Derrota. Tu pájaro se retira.'}
                                {lastResult === 'DRAW' && '😐 Empate. Ambos quedan cansados.'}
                            </Text>
                        </GlassCard>
                    )}
                </View>

                {/* Tu ave */}
                <GlassCard style={styles.playerZone}>
                    <Text style={styles.playerName}>🦅 {selectedBird?.name}</Text>
                    <Text style={styles.playerStats}>
                        ATK:{selectedBird?.stats.attack} DEF:{selectedBird?.stats.defense} VEL:{selectedBird?.stats.speed}
                    </Text>
                    <Text style={styles.playerAbility}>⚡ {selectedBird?.passiveAbility}</Text>
                </GlassCard>
            </View>
        );
    }

    // ─── FASE 3: Resultado de la Ronda ─────────────────────
    return (
        <View style={styles.container}>
            <View style={styles.resultContainer}>
                <Text style={styles.resultTitle}>
                    {lastResult === 'WIN' ? '🏆' : lastResult === 'LOSE' ? '💔' : '🤝'}
                </Text>
                <Text style={styles.resultTitle}>
                    {lastResult === 'WIN' && '¡Ronda Ganada!'}
                    {lastResult === 'LOSE' && 'Ronda Perdida'}
                    {lastResult === 'DRAW' && 'Empate'}
                </Text>

                <View style={styles.postureComparison}>
                    <View style={styles.postureCompareItem}>
                        <Text style={styles.compareLabel}>Tú</Text>
                        <Text style={styles.compareIcon}>
                            {POSTURES.find((p) => p.type === chosenPosture)?.icon}
                        </Text>
                        <Text style={styles.compareName}>{chosenPosture}</Text>
                    </View>
                    <Text style={styles.compareVs}>VS</Text>
                    <View style={styles.postureCompareItem}>
                        <Text style={styles.compareLabel}>Rival</Text>
                        <Text style={styles.compareIcon}>
                            {POSTURES.find((p) => p.type === rivalPosture)?.icon}
                        </Text>
                        <Text style={styles.compareName}>{rivalPosture}</Text>
                    </View>
                </View>

                <View style={styles.scoreSummary}>
                    <Text style={styles.scoreText}>Tú: {playerRep} ⭐ | Rival: {rivalRep} ⭐</Text>
                </View>

                <TouchableOpacity style={styles.nextButton} onPress={handleNextRound}>
                    <Text style={styles.nextButtonText}>▶ Siguiente Ronda</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.endButton} onPress={handleEndBattle}>
                    <Text style={styles.endButtonText}>🏁 Terminar Certamen</Text>
                </TouchableOpacity>

                {/* Consejo del rival tras perder */}
                {rivalTip && lastResult === 'LOSE' && (
                    <div style={{ animation: 'tipSlide 0.5s ease-out', marginTop: 12 }}>
                        <GlassCard style={styles.rivalTipCard}>
                            <Text style={styles.rivalTipLabel}>🤖 Consejo del rival:</Text>
                            <Text style={styles.rivalTipText}>"{rivalTip}"</Text>
                        </GlassCard>
                    </div>
                )}
            </View>
        </View>
    );
}

// ─── ESTILOS ─────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1A1A2E',
        paddingTop: 48,
        paddingHorizontal: spacing.lg,
    },
    header: {
        alignItems: 'center',
        gap: spacing.md,
        marginBottom: spacing.xl,
    },
    title: {
        fontSize: typography.sizeTitle,
        fontWeight: typography.weightBold,
        color: colors.background,
        fontFamily: typography.fontTitle,
    },
    scoreBoard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.lg,
    },
    scoreCard: {
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
    },
    scoreLabel: {
        fontSize: typography.sizeCaption,
        color: colors.text,
    },
    scoreValue: {
        fontSize: typography.sizeTitle,
        fontWeight: typography.weightBold,
        color: colors.secondary,
    },
    vs: {
        fontSize: typography.sizeTitle,
        fontWeight: typography.weightBold,
        color: colors.canto,
    },
    turnInfo: {
        fontSize: typography.sizeCaption,
        color: 'rgba(253, 251, 247, 0.7)',
        fontFamily: typography.fontBody,
    },
    repBarContainer: {
        width: '80%' as any,
        height: 6,
        backgroundColor: 'rgba(253, 251, 247, 0.15)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    sectionTitle: {
        fontSize: typography.sizeBody,
        color: colors.background,
        marginBottom: spacing.md,
        fontFamily: typography.fontBody,
    },

    // Bird Selection
    birdGrid: {
        gap: spacing.md,
        paddingBottom: spacing.xl,
    },
    noBirds: {
        color: 'rgba(253, 251, 247, 0.5)',
        textAlign: 'center',
        paddingVertical: spacing.xxl,
        fontSize: typography.sizeBody,
    },
    birdOption: {
        flexDirection: 'row',
        backgroundColor: 'rgba(253, 251, 247, 0.1)',
        borderRadius: borders.radiusMedium,
        overflow: 'hidden',
        ...shadows.card,
    },
    birdPhoto: {
        width: 70,
        height: 70,
        backgroundColor: colors.primaryLight,
    },
    birdOptionInfo: {
        flex: 1,
        padding: spacing.md,
        justifyContent: 'center',
        gap: 2,
    },
    birdOptionName: {
        fontSize: typography.sizeBody,
        fontWeight: typography.weightBold,
        color: colors.background,
        fontFamily: typography.fontBody,
    },
    birdOptionCost: {
        fontSize: typography.sizeCaption,
        color: colors.secondary,
    },
    birdOptionPosture: {
        fontSize: typography.sizeSmall,
        color: 'rgba(253, 251, 247, 0.6)',
    },

    // Battle Zone
    rivalZone: {
        alignItems: 'center',
        gap: spacing.xs,
        marginBottom: spacing.lg,
    },
    rivalName: {
        fontSize: typography.sizeSubtitle,
        fontWeight: typography.weightBold,
        color: colors.canto,
        fontFamily: typography.fontBody,
    },
    rivalStats: {
        fontSize: typography.sizeCaption,
        color: colors.text,
        fontFamily: typography.fontBody,
    },
    rivalPosture: {
        fontSize: typography.sizeCaption,
        color: colors.secondary,
        fontWeight: typography.weightBold,
    },

    battleCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing.xl,
    },
    battleTitle: {
        fontSize: typography.sizeSubtitle,
        fontWeight: typography.weightBold,
        color: colors.background,
        fontFamily: typography.fontTitle,
    },
    triangleInfo: {
        backgroundColor: 'rgba(253, 251, 247, 0.1)',
        borderRadius: borders.radiusMedium,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        gap: 4,
    },
    triangleText: {
        fontSize: typography.sizeSmall,
        color: 'rgba(253, 251, 247, 0.8)',
        fontFamily: typography.fontBody,
    },

    // Posture Buttons
    postureRow: {
        flexDirection: 'row',
        gap: spacing.lg,
    },
    postureButton: {
        width: 90,
        height: 90,
        borderRadius: borders.radiusFull,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.glass,
        gap: spacing.xs,
    },
    postureBlocked: {
        opacity: 0.4,
    },
    postureChosen: {
        borderWidth: 4,
        borderColor: colors.warning,
    },
    postureIcon: {
        fontSize: 32,
    },
    postureLabel: {
        fontSize: typography.sizeSmall,
        color: colors.white,
        fontWeight: typography.weightBold,
    },
    postureHelp: {
        fontSize: 9,
        color: 'rgba(255,255,255,0.6)',
        fontStyle: 'italic',
    },
    blockedIcon: {
        position: 'absolute',
        top: 4,
        right: 4,
        fontSize: 14,
    },

    // Duel Result
    duelResult: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
    },
    duelWin: {
        backgroundColor: 'rgba(39, 174, 96, 0.2)',
        borderColor: colors.success,
    },
    duelLose: {
        backgroundColor: 'rgba(231, 76, 60, 0.2)',
        borderColor: colors.error,
    },
    duelDraw: {
        backgroundColor: 'rgba(243, 156, 18, 0.2)',
        borderColor: colors.warning,
    },
    duelResultText: {
        fontSize: typography.sizeBody,
        fontWeight: typography.weightBold,
        color: colors.text,
        textAlign: 'center',
    },

    // Player Zone
    playerZone: {
        alignItems: 'center',
        gap: spacing.xs,
        marginTop: spacing.lg,
        marginBottom: spacing.lg,
    },
    playerName: {
        fontSize: typography.sizeSubtitle,
        fontWeight: typography.weightBold,
        color: colors.primary,
        fontFamily: typography.fontBody,
    },
    playerStats: {
        fontSize: typography.sizeCaption,
        color: colors.text,
        fontFamily: typography.fontBody,
    },
    playerAbility: {
        fontSize: typography.sizeSmall,
        color: colors.secondary,
        fontStyle: 'italic',
    },

    // Result Phase
    resultContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing.xl,
    },
    resultTitle: {
        fontSize: typography.sizeTitle,
        fontWeight: typography.weightBold,
        color: colors.background,
        fontFamily: typography.fontTitle,
        textAlign: 'center',
    },
    postureComparison: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xl,
    },
    postureCompareItem: {
        alignItems: 'center',
        gap: spacing.xs,
    },
    compareLabel: {
        fontSize: typography.sizeCaption,
        color: 'rgba(253, 251, 247, 0.6)',
    },
    compareIcon: {
        fontSize: 48,
    },
    compareName: {
        fontSize: typography.sizeCaption,
        color: colors.background,
        fontWeight: typography.weightBold,
    },
    compareVs: {
        fontSize: typography.sizeTitle,
        fontWeight: typography.weightBold,
        color: colors.canto,
    },
    scoreSummary: {
        backgroundColor: 'rgba(253, 251, 247, 0.1)',
        borderRadius: borders.radiusFull,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
    },
    scoreText: {
        fontSize: typography.sizeBody,
        color: colors.background,
        fontWeight: typography.weightBold,
    },

    // Buttons
    nextButton: {
        backgroundColor: colors.primary,
        borderRadius: borders.radiusFull,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xxl,
        ...shadows.glass,
    },
    nextButtonText: {
        color: colors.white,
        fontSize: typography.sizeBody,
        fontWeight: typography.weightBold,
    },
    endButton: {
        backgroundColor: 'rgba(253, 251, 247, 0.15)',
        borderRadius: borders.radiusFull,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xxl,
        borderWidth: 1,
        borderColor: 'rgba(253, 251, 247, 0.3)',
    },
    endButtonText: {
        color: 'rgba(253, 251, 247, 0.8)',
        fontSize: typography.sizeBody,
        fontWeight: typography.weightSemiBold,
    },

    // Rival Tip
    rivalTipCard: {
        backgroundColor: 'rgba(231, 76, 60, 0.1)',
        borderColor: 'rgba(231, 76, 60, 0.3)',
        borderWidth: 1,
        alignItems: 'center',
        gap: spacing.xs,
    },
    rivalTipLabel: {
        fontSize: typography.sizeSmall,
        color: colors.canto,
        fontWeight: typography.weightBold,
    },
    rivalTipText: {
        fontSize: typography.sizeCaption,
        color: 'rgba(253, 251, 247, 0.8)',
        fontStyle: 'italic',
        textAlign: 'center',
        fontFamily: typography.fontBody,
    },
});
