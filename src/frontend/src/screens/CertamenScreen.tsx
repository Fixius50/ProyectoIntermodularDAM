import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { GlassCard } from '../components/GlassCard';
import { useGame } from '../context/GameContext';
import { BirdCard } from '../types/types';
import { colors, spacing, borders, shadows } from '../theme/theme';
import { DraggableCard } from '../components/DraggableCard';
import { battleSocket, BattleSession } from '../services/battleSocket';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * FULL REWRITE: CertamenScreen 2.0
 * Features: Drag-and-Drop, Multiplayer Sync (RSocket), Turn-Based Logic.
 */
export function CertamenScreen() {
    const { state } = useGame();
    const { player } = state;

    const [session, setSession] = useState<BattleSession | null>(null);
    const [isConnecting, setIsConnecting] = useState(true);

    // Drag state for overlay
    const [draggingBird, setDraggingBird] = useState<BirdCard | null>(null);
    const [dragPos, setDragPos] = useState({ x: 0, y: 0 });

    // 1. Connection & Subscription
    useEffect(() => {
        const init = async () => {
            try {
                await battleSocket.connect();
                // For demonstration, we automatically create/join a match
                // in a real app, this would come from a lobby screen
                const defaultRoomId = "avis-room-01";

                // Try joining first, if it fails, create? 
                // For simplicity in this demo, we use a single fixed flow
                battleSocket.streamBattle(defaultRoomId).subscribe({
                    next: (updatedSession) => {
                        console.log("Battle Update:", updatedSession);
                        setSession(updatedSession);
                    },
                    error: (err) => console.error("Stream Error:", err)
                });

                // Initial fetch/join
                battleSocket.joinMatch(defaultRoomId, player.name).subscribe(s => setSession(s));

                setIsConnecting(false);
            } catch (error) {
                console.error("Init Error:", error);
                setIsConnecting(false);
            }
        };

        init();
    }, []);

    const handleDrop = useCallback((bird: BirdCard) => {
        if (!session) return;

        console.log(`Action: Player ${player.name} playing ${bird.name}`);

        // Send action to backend (Multiplayer sync)
        battleSocket.sendAction({
            sessionId: session.sessionId,
            playerId: player.name,
            seedsSpent: bird.cost
        });

        // The UI will update via the Subscription above when the backend resolves the round
    }, [session, player.name]);

    if (isConnecting) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color={colors.secondary} />
                <Text style={styles.hudText}>Conectando con el servidor de batalla...</Text>
            </View>
        );
    }

    const isWaiting = session?.playerOneId === player.name
        ? session?.playerOnePendingAction !== null
        : session?.playerTwoPendingAction !== null;

    const myHealth = session?.playerOneId === player.name ? session?.playerOneHealth : session?.playerTwoHealth;
    const rivalHealth = session?.playerOneId === player.name ? session?.playerTwoHealth : session?.playerOneHealth;

    return (
        <View style={styles.container}>
            {/* HUD / Scoreboard */}
            <View style={styles.hud}>
                <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Ronda</Text>
                    <Text style={styles.statValue}>{session?.currentRound || 1}</Text>
                </View>
                <View style={styles.healthLabels}>
                    <Text style={styles.healthText}>Tú: {myHealth}%</Text>
                    <Text style={styles.healthText}>Rival: {rivalHealth}%</Text>
                </View>
                <View style={[styles.statBox, { borderColor: colors.secondary }]}>
                    <Text style={styles.statLabel}>Estado</Text>
                    <Text style={[styles.statValue, { fontSize: 10 }]}>{session?.status}</Text>
                </View>
            </View>

            {/* Board Area */}
            <View style={styles.board}>
                <Text style={styles.boardTitle}>TABLERO DE DUELO</Text>

                <View style={styles.dropZone}>
                    {isWaiting ? (
                        <GlassCard style={styles.waitingOverlay}>
                            <ActivityIndicator color={colors.white} />
                            <Text style={styles.waitingText}>Esperando al oponente...</Text>
                        </GlassCard>
                    ) : (
                        <Text style={styles.hintText}>Arrastra una carta aquí para atacar</Text>
                    )}
                </View>
            </View>

            {/* Hand Area */}
            <View style={styles.handContainer}>
                <Text style={styles.handTitle}>Tu Colección</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.handScroll}
                    scrollEnabled={!draggingBird}
                >
                    {player.collection.map((bird) => (
                        <View key={bird.id} style={styles.cardWrapper}>
                            <DraggableCard
                                card={bird}
                                onDrop={handleDrop}
                                onDragStart={(card) => setDraggingBird(card)}
                                onDragUpdate={(pos) => setDragPos(pos)}
                                onDragEnd={() => setDraggingBird(null)}
                            />
                        </View>
                    ))}
                </ScrollView>
            </View>

            {/* Global Drag Overlay */}
            {draggingBird && (
                <View
                    style={[
                        styles.dragOverlay,
                        { left: dragPos.x - 60, top: dragPos.y - 80 } // Center the card on finger
                    ]}
                    pointerEvents="none"
                >
                    <DraggableCard
                        card={draggingBird}
                        onDrop={() => { }}
                        isOverlay={true}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3E2723',
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
    },
    hud: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: spacing.lg,
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingBottom: 15,
    },
    statBox: {
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        padding: 8,
        borderRadius: 8,
        minWidth: 60,
    },
    statLabel: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 10,
        textTransform: 'uppercase',
    },
    statValue: {
        color: colors.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    healthLabels: {
        alignItems: 'center',
        gap: 4,
    },
    healthText: {
        color: colors.secondary,
        fontWeight: 'bold',
        fontSize: 14,
    },
    hudText: {
        color: colors.white,
        fontWeight: 'bold',
    },
    board: {
        flex: 1,
        margin: spacing.md,
        backgroundColor: '#5D4037',
        borderRadius: 24,
        borderWidth: 8,
        borderColor: '#2D1A14',
        ...shadows.card,
        padding: spacing.md,
        alignItems: 'center',
    },
    boardTitle: {
        color: 'rgba(255,255,255,0.2)',
        fontWeight: 'bold',
        letterSpacing: 4,
        fontSize: 12,
        marginBottom: 20,
    },
    dropZone: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
    },
    hintText: {
        color: 'rgba(255,255,255,0.3)',
        fontStyle: 'italic',
        fontSize: 12,
    },
    waitingOverlay: {
        padding: 20,
        alignItems: 'center',
        gap: 15,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    waitingText: {
        color: colors.white,
        fontWeight: 'bold',
    },
    handContainer: {
        height: 220,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: 15,
        overflow: 'visible', // CRITICAL for drag-out
        zIndex: 50,
        elevation: 50,
    },
    handTitle: {
        color: colors.white,
        fontSize: 10,
        textAlign: 'center',
        opacity: 0.5,
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 10,
    },
    handScroll: {
        paddingHorizontal: spacing.lg,
        alignItems: 'center',
        gap: spacing.md,
        overflow: 'visible', // CRITICAL
    },
    cardWrapper: {
        width: 120,
        height: 160,
    },
    dragOverlay: {
        position: 'absolute',
        width: 120,
        height: 160,
        zIndex: 9999,
        elevation: 9999,
        transform: [{ scale: 1.15 }],
    }
});
