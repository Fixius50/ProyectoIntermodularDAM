import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Image, useWindowDimensions } from 'react-native';
import { GlassCard } from '../components/GlassCard';
import { useGame } from '../context/GameContext';
import { BirdCard } from '../types/types';
import { colors, spacing, borders, shadows } from '../theme/theme';
import { BirdCardView } from '../components/BirdCardView';

// Eliminamos SCREEN_WIDTH estático para usar useWindowDimensions

// ─── CONFIGURACIÓN SIMPLE ──────────────────────────────
const MAX_ROUNDS = 5;
const SLOT_COUNT = 6;

const RIVAL_BIRDS_POOL: BirdCard[] = [
    {
        id: 'rival-1',
        name: 'Búho Real',
        photo: 'https://images.unsplash.com/photo-1543542245-316823ca86e0?q=80&w=1000',
        cost: 3,
        stats: { attack: 7, defense: 6, speed: 5 },
        level: 8,
        preferredPosture: 'VUELO',
        passiveAbility: 'Gana +2 en ataque',
        xp: 0,
        xpToNextLevel: 1000,
        scientificName: 'Bubo bubo',
        habitat: 'MONTAÑA',
        curiosity: '',
    },
    {
        id: 'rival-2',
        name: 'Águila Pescadora',
        photo: 'https://images.unsplash.com/photo-1565118531796-763e5082d113?q=80&w=1000',
        cost: 2,
        stats: { attack: 6, defense: 4, speed: 8 },
        level: 6,
        preferredPosture: 'PLUMAJE',
        passiveAbility: 'Gana +1 de maná',
        xp: 0,
        xpToNextLevel: 1000,
        scientificName: 'Pandion haliaetus',
        habitat: 'MONTAÑA',
        curiosity: '',
    },
    {
        id: 'rival-3',
        name: 'Halcón Peregrino',
        photo: 'https://images.unsplash.com/photo-1612170153139-6f881ff067e0?q=80&w=1000',
        cost: 4,
        stats: { attack: 8, defense: 2, speed: 10 },
        level: 9,
        preferredPosture: 'VUELO',
        passiveAbility: 'Ataca primero',
        xp: 0,
        xpToNextLevel: 1000,
        scientificName: 'Falco peregrinus',
        habitat: 'MONTAÑA',
        curiosity: '',
    }
];

export function CertamenScreen() {
    const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
    const { state } = useGame();
    const { player } = state;

    // Cálculos Responsivos
    const tableMargin = spacing.md;
    const tablePadding = spacing.sm;
    const gridGap = 8;
    const slotWidth = (SCREEN_WIDTH - (tableMargin * 2) - (tablePadding * 2) - (gridGap * 2)) / 3;
    const slotHeight = Math.min(slotWidth * 1.4, SCREEN_HEIGHT * 0.15);

    // Estado del Tablero
    const [playerTable, setPlayerTable] = useState<(BirdCard | null)[]>(new Array(SLOT_COUNT).fill(null));
    const [rivalTable, setRivalTable] = useState<(BirdCard | null)[]>(() => {
        // Pre-poblamos con 2 pájaros rivales para la primera ronda
        const initial = new Array(SLOT_COUNT).fill(null);
        initial[0] = { ...RIVAL_BIRDS_POOL[0], id: 'rival-init-1' };
        initial[1] = { ...RIVAL_BIRDS_POOL[1], id: 'rival-init-2' };
        return initial;
    });

    // Estado de la Partida
    const [turn, setTurn] = useState(1);
    const [playerRep, setPlayerRep] = useState(0);
    const [rivalRep, setRivalRep] = useState(0);
    const [lastMessage, setLastMessage] = useState("¡Bienvenido al Certamen! Toca un pájaro de tu mano para jugar.");
    const [selectedPlayerIdx, setSelectedPlayerIdx] = useState<number | null>(null);
    const [phase, setPhase] = useState<'BATTLE' | 'FINAL'>('BATTLE');

    // Función para añadir pájaro al tablero
    const handlePlayCard = (bird: BirdCard) => {
        console.log("Playing card:", bird.name);
        const emptyIdx = playerTable.findIndex(slot => slot === null);
        if (emptyIdx === -1) {
            setLastMessage("Tu tablero está lleno");
            return;
        }

        const newPlayerTable = [...playerTable];
        newPlayerTable[emptyIdx] = bird;
        setPlayerTable(newPlayerTable);
        setLastMessage(`¡Has jugado a ${bird.name}! Toca tu carta para atacar.`);

        // El rival responde posicionando uno aleatorio
        setTimeout(() => {
            const emptyRivalIdx = rivalTable.findIndex(slot => slot === null);
            if (emptyRivalIdx !== -1) {
                const randomRival = RIVAL_BIRDS_POOL[Math.floor(Math.random() * RIVAL_BIRDS_POOL.length)];
                const newRivalTable = [...rivalTable];
                newRivalTable[emptyRivalIdx] = { ...randomRival, id: `rival-${Date.now()}` };
                setRivalTable(newRivalTable);
                setLastMessage(`El rival ha jugado a ${randomRival.name}`);
            }
        }, 500);
    };

    // Función de Ataque
    const handleAttack = (rivalIdx: number) => {
        console.log("Attacking rival at:", rivalIdx);
        if (selectedPlayerIdx === null) {
            setLastMessage("Selecciona primero uno de tus pájaros (borde dorado)");
            return;
        }

        const playerBird = playerTable[selectedPlayerIdx];
        const rivalBird = rivalTable[rivalIdx];

        if (!playerBird || !rivalBird) return;

        const damage = Math.max(1, playerBird.stats.attack - rivalBird.stats.defense);
        const points = damage * 10;
        setPlayerRep(prev => prev + points);
        setLastMessage(`¡${playerBird.name} ataca! Ganas ${points} puntos.`);

        // El rival contraataca
        const counterDamage = Math.max(1, rivalBird.stats.attack - playerBird.stats.defense);
        setRivalRep(prev => prev + counterDamage * 10);

        setSelectedPlayerIdx(null);
    };

    const handleNextPhase = () => {
        if (turn >= MAX_ROUNDS) {
            setPhase('FINAL');
        } else {
            setTurn(prev => prev + 1);
            setPlayerTable(new Array(SLOT_COUNT).fill(null));

            // Nueva ronda: Rival con pájaros frescos
            const newRivalTable = new Array(SLOT_COUNT).fill(null);
            newRivalTable[0] = { ...RIVAL_BIRDS_POOL[Math.floor(Math.random() * 3)], id: `rival-r${turn}-1` };
            newRivalTable[1] = { ...RIVAL_BIRDS_POOL[Math.floor(Math.random() * 3)], id: `rival-r${turn}-2` };
            setRivalTable(newRivalTable);

            setLastMessage(`Ronda ${turn + 1}: ¡Prepárate!`);
        }
    };

    return (
        <View style={styles.container}>
            {/* HUD */}
            <View style={styles.hud}>
                <Text style={styles.hudText}>Ronda: {turn}/{MAX_ROUNDS}</Text>
                <Text style={styles.hudText}>🏆 Tú: {playerRep} | 🤖 Rival: {rivalRep}</Text>
            </View>

            {phase === 'BATTLE' ? (
                <>
                    <View style={styles.table}>
                        <Text style={styles.sideLabel}>LADO RIVAL</Text>
                        {/* RIVAL SIDE */}
                        <View style={styles.grid}>
                            {rivalTable.map((bird, idx) => (
                                <TouchableOpacity
                                    key={`rival-${idx}`}
                                    style={[
                                        styles.slot,
                                        { width: slotWidth, height: slotHeight },
                                        bird && styles.occupiedRival,
                                        (selectedPlayerIdx !== null && bird) && styles.targetable
                                    ]}
                                    onPress={() => handleAttack(idx)}
                                // Cambiado: No disableamos para que el usuario reciba el feedback si no tiene seleccionado nada
                                >
                                    {bird ? (
                                        <Image source={{ uri: bird.photo }} style={styles.cardImg} />
                                    ) : (
                                        <View style={styles.emptySlot} />
                                    )}
                                    {bird && <Text style={styles.cardPower}>⚔️ {bird.stats.attack}</Text>}
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.divider} />

                        <Text style={styles.sideLabel}>TU LADO</Text>
                        {/* PLAYER SIDE */}
                        <View style={styles.grid}>
                            {playerTable.map((bird, idx) => (
                                <TouchableOpacity
                                    key={`player-${idx}`}
                                    style={[
                                        styles.slot,
                                        { width: slotWidth, height: slotHeight },
                                        bird && styles.occupiedPlayer,
                                        selectedPlayerIdx === idx && styles.selected
                                    ]}
                                    onPress={() => {
                                        if (bird) {
                                            setSelectedPlayerIdx(idx === selectedPlayerIdx ? null : idx);
                                            if (idx !== selectedPlayerIdx) setLastMessage("Pájaro seleccionado. ¡Toca un rival para atacar!");
                                        }
                                    }}
                                >
                                    {bird ? (
                                        <Image source={{ uri: bird.photo }} style={styles.cardImg} />
                                    ) : (
                                        <View style={styles.emptySlot} />
                                    )}
                                    {bird && <Text style={styles.cardPower}>⚔️ {bird.stats.attack}</Text>}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.messageArea}>
                        <Text style={styles.messageText}>{lastMessage}</Text>
                    </View>

                    {/* MANO */}
                    <View style={styles.handContainer}>
                        <Text style={styles.handHint}>Toca una carta para posicionarla:</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.handPadding}>
                            {(player.collection.length > 0 ? player.collection : RIVAL_BIRDS_POOL).map((bird, idx) => (
                                <TouchableOpacity
                                    key={`${bird.id}-${idx}`}
                                    style={styles.handCard}
                                    onPress={() => handlePlayCard(bird)}
                                >
                                    <BirdCardView card={bird} mode="mini" />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <TouchableOpacity style={styles.nextBtn} onPress={handleNextPhase}>
                            <Text style={styles.nextBtnText}>Finalizar Ronda y Avanzar ⚔️</Text>
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                <View style={styles.finalPhase}>
                    <GlassCard style={styles.finalResult}>
                        <Text style={styles.finalTitle}>¡Certamen Finalizado!</Text>
                        <Text style={styles.finalScore}>{playerRep} - {rivalRep}</Text>
                        <Text style={styles.finalVerdict}>
                            {playerRep > rivalRep ? "¡VICTORIA!" : playerRep < rivalRep ? "DERROTA" : "EMPATE"}
                        </Text>
                        <TouchableOpacity style={styles.resetBtn} onPress={() => {/* Back to map */ }}>
                            <Text style={styles.resetBtnText}>Volver al Refugio</Text>
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
        backgroundColor: '#4E342E',
        paddingTop: 40,
    },
    hud: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: spacing.md,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    hudText: {
        color: colors.white,
        fontWeight: 'bold',
        fontSize: 14,
    },
    table: {
        flex: 1,
        margin: spacing.md,
        backgroundColor: '#5D4037',
        borderRadius: 20,
        borderWidth: 4,
        borderColor: '#3E2723',
        padding: spacing.sm,
        justifyContent: 'center',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignContent: 'center',
        gap: 8,
    },
    slot: {
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        backgroundColor: 'rgba(0,0,0,0.1)',
        overflow: 'hidden',
        position: 'relative',
    },
    emptySlot: {
        flex: 1,
    },
    cardImg: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginVertical: spacing.sm,
        width: '100%',
    },
    occupiedPlayer: {
        borderColor: 'rgba(255,255,255,0.5)',
    },
    occupiedRival: {
        borderColor: 'rgba(255,100,100,0.5)',
    },
    selected: {
        borderColor: colors.secondary,
        borderWidth: 3,
    },
    targetable: {
        borderColor: colors.error,
        borderWidth: 2,
        backgroundColor: 'rgba(255,0,0,0.1)',
    },
    sideLabel: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
        letterSpacing: 2,
    },
    cardPower: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: colors.secondary,
        fontSize: 10,
        paddingHorizontal: 4,
        borderRadius: 4,
        fontWeight: 'bold',
    },
    messageArea: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        alignItems: 'center',
    },
    messageText: {
        color: colors.white,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        fontSize: 13,
        textAlign: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    handContainer: {
        flex: 0.6, // Altura relativa para la mano
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: spacing.md,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    handHint: {
        color: colors.secondary,
        fontSize: 12,
        marginBottom: 10,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    handPadding: {
        paddingBottom: 10,
        alignItems: 'center',
    },
    handCard: {
        marginRight: spacing.sm,
        height: '100%',
    },
    nextBtn: {
        backgroundColor: colors.primary,
        padding: spacing.md,
        borderRadius: 12,
        marginTop: spacing.sm,
        alignItems: 'center',
    },
    nextBtnText: {
        color: colors.white,
        fontWeight: 'bold',
    },
    finalPhase: {
        flex: 1,
        justifyContent: 'center',
        padding: spacing.xl,
    },
    finalResult: {
        padding: spacing.xl,
        alignItems: 'center',
    },
    finalTitle: {
        fontSize: 24,
        color: colors.white,
        fontWeight: 'bold',
    },
    finalScore: {
        fontSize: 48,
        color: colors.secondary,
        marginVertical: 20,
        fontWeight: 'bold',
    },
    finalVerdict: {
        fontSize: 20,
        color: colors.white,
        marginBottom: 30,
    },
    resetBtn: {
        backgroundColor: colors.secondary,
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: borders.radiusFull,
    },
    resetBtnText: {
        color: '#3E2723',
        fontWeight: 'bold',
    }
});
