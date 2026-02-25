import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { GlassCard } from '../components/GlassCard';
import { useGame } from '../context/GameContext';
import { BirdCard, PostureType, DuelResult } from '../types/types';
import { colors, typography, spacing, borders, shadows } from '../theme/theme';
import { DraggableCard } from '../components/DraggableCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── CONFIGURACIÓN DE PARTIDA ──────────────────────────────
const MAX_ROUNDS = 5;

// CSS animations for Certamen effects
const certamenAnimCSS = `
@keyframes woodGrain {
  0%   { background-position: 0% 0%; }
  100% { background-position: 100% 100%; }
}
@keyframes tableFloating {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
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

const RIVAL_BIRDS: BirdCard[] = [
    {
        id: 'rival-1',
        name: 'Búho Real',
        photo: 'https://images.unsplash.com/photo-1543542245-316823ca86e0?q=80&w=1000',
        cost: 3,
        preferredPosture: 'VUELO',
        passiveAbility: 'De noche, gana +2 en Ataque',
        stats: { attack: 7, defense: 6, speed: 5 },
        level: 8,
        xp: 0,
        xpToNextLevel: 1000,
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

export function CertamenScreen() {
    const { state, dispatch } = useGame();
    const { player, weather } = state;

    const [phase, setPhase] = useState<'BATTLE' | 'RESULT' | 'FINAL'>('BATTLE');
    const [selectedBird, setSelectedBird] = useState<BirdCard | null>(null);
    const [rivalBird] = useState<BirdCard>(RIVAL_BIRDS[0]);
    const [turn, setTurn] = useState(1);
    const [playerRep, setPlayerRep] = useState(0);
    const [rivalRep, setRivalRep] = useState(0);
    const [lastResult, setLastResult] = useState<DuelResult | null>(null);
    const [chosenPosture, setChosenPosture] = useState<PostureType | null>(null);
    const [rivalPosture, setRivalPosture] = useState<PostureType | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const mana = turn;

    const affordableBirds = useMemo(() =>
        player.collection.filter((b) => b.cost <= mana),
        [player.collection, mana]
    );

    const handleDropBird = useCallback((bird: BirdCard) => {
        setSelectedBird(bird);
        // Automáticamente elige postura preferida para agilizar el MVP del drag-and-drop
        const rivalChoice = POSTURES[Math.floor(Math.random() * 3)].type;
        const playerChoice = bird.preferredPosture;

        setChosenPosture(playerChoice);
        setRivalPosture(rivalChoice);

        const result = resolvePostureDuel(playerChoice, rivalChoice);
        setLastResult(result);

        if (result === 'WIN') setPlayerRep(r => r + 2);
        else if (result === 'LOSE') setRivalRep(r => r + 2);

        setTimeout(() => setPhase('RESULT'), 1500);
    }, []);

    const handleNextRound = useCallback(() => {
        if (turn >= MAX_ROUNDS) {
            setPhase('FINAL');
            return;
        }
        setTurn(t => t + 1);
        setSelectedBird(null);
        setChosenPosture(null);
        setRivalPosture(null);
        setLastResult(null);
        setPhase('BATTLE');
    }, [turn]);

    const renderTable = () => (
        <View style={styles.tableArea}>
            {/* Rival Zone */}
            <View style={styles.rivalSlot}>
                <Image source={{ uri: rivalBird.photo }} style={styles.cardOnTable} />
                <View style={styles.nameTagRival}>
                    <Text style={styles.tagText}>{rivalBird.name}</Text>
                    <Text style={styles.tagLevel}>Nf. {rivalBird.level}</Text>
                </View>
                {rivalPosture && (
                    <View style={styles.postureCircleRival}>
                        <Text style={styles.postureIconSmall}>
                            {POSTURES.find(p => p.type === rivalPosture)?.icon}
                        </Text>
                    </View>
                )}
            </View>

            {/* Duel Zone (Empty if no bird selected) */}
            <View style={[
                styles.duelZone,
                isDragging && styles.duelZoneActive
            ]}>
                {selectedBird ? (
                    <Image source={{ uri: selectedBird.photo }} style={styles.cardOnTablePlayer} />
                ) : (
                    <View style={styles.dropZoneHint}>
                        <Text style={styles.hintText}>
                            {isDragging ? '¡Suelta aquí!' : 'Arrastra tu pájaro aquí'}
                        </Text>
                    </View>
                )}
                {chosenPosture && (
                    <View style={styles.postureCirclePlayer}>
                        <Text style={styles.postureIconSmall}>
                            {POSTURES.find(p => p.type === chosenPosture)?.icon}
                        </Text>
                    </View>
                )}
            </View>

            {lastResult && (
                <View style={styles.resultOverlay}>
                    <Text style={styles.resultTextBig}>
                        {lastResult === 'WIN' ? '¡VICTORIA!' : lastResult === 'LOSE' ? 'DERROTA' : 'EMPATE'}
                    </Text>
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <style>{certamenAnimCSS}</style>

            {/* HUD / Header */}
            <View style={styles.hud}>
                <View style={styles.roundTracker}>
                    <Text style={styles.roundText}>Ronda {turn}/{MAX_ROUNDS}</Text>
                </View>
                <View style={styles.repContainer}>
                    <Text style={styles.repText}>🏆 Tú: {playerRep} | 🤖 Rival: {rivalRep}</Text>
                </View>
                <View style={styles.manaContainer}>
                    <Text style={styles.manaText}>🌰 {turn}</Text>
                </View>
            </View>

            {phase === 'BATTLE' ? (
                <>
                    {renderTable()}

                    {/* Player Hand Area */}
                    <View style={styles.handArea}>
                        <Text style={styles.handTitle}>Tu Mano (Arrastra para jugar)</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.handScroll}
                            scrollEnabled={!isDragging}
                        >
                            {affordableBirds.map(bird => (
                                <View key={bird.id} style={styles.cardInHand}>
                                    <DraggableCard
                                        card={bird}
                                        onDrop={handleDropBird}
                                        onDragStart={() => setIsDragging(true)}
                                        onDragEnd={() => setIsDragging(false)}
                                    />
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </>
            ) : phase === 'RESULT' ? (
                <View style={styles.resultPhase}>
                    <GlassCard style={styles.resultSummary}>
                        <Text style={styles.resultSummaryTitle}>Resultados de la Ronda {turn}</Text>
                        <View style={styles.comparisonRow}>
                            <View style={styles.compareCol}>
                                <Text style={styles.colLabel}>Tú</Text>
                                <Text style={styles.colIcon}>{POSTURES.find(p => p.type === chosenPosture)?.icon}</Text>
                            </View>
                            <Text style={styles.vsText}>VS</Text>
                            <View style={styles.compareCol}>
                                <Text style={styles.colLabel}>Rival</Text>
                                <Text style={styles.colIcon}>{POSTURES.find(p => p.type === rivalPosture)?.icon}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.nextBtn} onPress={handleNextRound}>
                            <Text style={styles.nextBtnText}>
                                {turn < MAX_ROUNDS ? 'Siguiente Ronda' : 'Ver Resultado Final'}
                            </Text>
                        </TouchableOpacity>
                    </GlassCard>
                </View>
            ) : (
                <View style={styles.resultPhase}>
                    <GlassCard style={styles.resultSummary}>
                        <Text style={styles.resultSummaryTitle}>¡Certamen Finalizado!</Text>
                        <View style={styles.finalScore}>
                            <Text style={styles.finalScoreText}>Puntuación Final</Text>
                            <Text style={styles.finalScoreValue}>{playerRep} - {rivalRep}</Text>
                        </View>
                        <Text style={styles.matchVerdict}>
                            {playerRep > rivalRep ? '¡HAS GANADO EL CERTAMEN!' :
                                playerRep < rivalRep ? 'EL RIVAL HA GANADO' : '¡EMPATE TÉCNICO!'}
                        </Text>
                        <TouchableOpacity
                            style={styles.nextBtn}
                            onPress={() => {/* Aquí volvería al mapa o dashboard */ }}
                        >
                            <Text style={styles.nextBtnText}>Volver al Refugio</Text>
                        </TouchableOpacity>
                    </GlassCard>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4E342E', // Color madera oscura base
    },
    hud: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingHorizontal: spacing.lg,
        zIndex: 10,
    },
    repContainer: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: borders.radiusFull,
    },
    roundTracker: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: borders.radiusFull,
    },
    roundText: {
        color: colors.secondary,
        fontSize: 12,
        fontWeight: 'bold',
    },
    repText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: 'bold',
    },
    manaContainer: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.secondary,
    },
    manaText: {
        color: colors.secondary,
        fontWeight: 'bold',
    },
    tableArea: {
        flex: 1,
        margin: spacing.md,
        backgroundColor: '#5D4037', // Tinte de madera
        borderRadius: 20,
        borderWidth: 8,
        borderColor: '#3E2723',
        ...shadows.card,
        elevation: 10,
        zIndex: 10,
        padding: spacing.md,
        justifyContent: 'space-between',
    },
    rivalSlot: {
        alignItems: 'center',
        position: 'relative',
    },
    duelZone: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
        marginVertical: spacing.lg,
    },
    duelZoneActive: {
        borderColor: colors.secondary,
        backgroundColor: 'rgba(255,255,255,0.1)',
        transform: [{ scale: 1.02 }],
    },
    cardOnTable: {
        width: 100,
        height: 140,
        borderRadius: 10,
        borderWidth: 3,
        borderColor: colors.canto,
    },
    cardOnTablePlayer: {
        width: 120,
        height: 160,
        borderRadius: 12,
        borderWidth: 4,
        borderColor: colors.primary,
        ...shadows.glass,
    },
    dropZoneHint: {
        opacity: 0.3,
    },
    hintText: {
        color: colors.white,
        fontSize: 14,
        fontStyle: 'italic',
    },
    nameTagRival: {
        position: 'absolute',
        bottom: -10,
        backgroundColor: colors.canto,
        paddingHorizontal: 8,
        borderRadius: 4,
    },
    tagText: {
        color: colors.white,
        fontSize: 10,
        fontWeight: 'bold',
    },
    tagLevel: {
        color: colors.white,
        fontSize: 8,
        opacity: 0.8,
        textAlign: 'center',
    },
    postureCircleRival: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    postureCirclePlayer: {
        position: 'absolute',
        top: '20%',
        right: '25%',
        backgroundColor: colors.primary,
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.white,
    },
    postureIconSmall: {
        fontSize: 14,
    },
    handArea: {
        height: 250,
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingVertical: spacing.md,
        zIndex: 50,
        elevation: 50,
        overflow: 'visible',
    },
    handTitle: {
        color: colors.white,
        fontSize: 12,
        textAlign: 'center',
        marginBottom: spacing.sm,
        opacity: 0.6,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    handScroll: {
        paddingHorizontal: spacing.lg,
        alignItems: 'center',
        gap: spacing.md,
        overflow: 'visible',
    },
    cardInHand: {
        width: 150,
        overflow: 'visible',
        zIndex: 100,
        elevation: 100,
    },
    resultOverlay: {
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingVertical: spacing.md,
    },
    resultTextBig: {
        color: colors.white,
        fontSize: 32,
        fontWeight: 'bold',
        letterSpacing: 4,
    },
    resultPhase: {
        flex: 1,
        justifyContent: 'center',
        padding: spacing.xl,
    },
    resultSummary: {
        padding: spacing.xl,
        alignItems: 'center',
        gap: spacing.lg,
    },
    resultSummaryTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
    },
    comparisonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xl,
    },
    compareCol: {
        alignItems: 'center',
        gap: spacing.sm,
    },
    colLabel: {
        fontSize: 12,
        opacity: 0.6,
    },
    colIcon: {
        fontSize: 48,
    },
    vsText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.primary,
    },
    nextBtn: {
        backgroundColor: colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: borders.radiusFull,
    },
    nextBtnText: {
        color: colors.white,
        fontWeight: 'bold',
    },
    finalScore: {
        alignItems: 'center',
        marginVertical: spacing.lg,
    },
    finalScoreText: {
        fontSize: 16,
        color: colors.text,
        opacity: 0.7,
    },
    finalScoreValue: {
        fontSize: 48,
        fontWeight: 'bold',
        color: colors.primary,
    },
    matchVerdict: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.secondary,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
});

