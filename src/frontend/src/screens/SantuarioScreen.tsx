import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import { GlassCard } from '../components/GlassCard';
import { ResourceCounter } from '../components/ResourceCounter';
import { WeatherBackground } from '../components/WeatherBackground';
import { BirdCardView } from '../components/BirdCardView';
import { useGame } from '../context/GameContext';
import { fetchCurrentWeather } from '../services/weatherService';
import { colors, typography, spacing, borders, shadows } from '../theme/theme';
import { BirdCard } from '../types/types';

/* ─── CSS Animaciones del Santuario ──────────────────────── */
const santuarioCSS = `
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
@keyframes craftPulse {
  0%, 100% { box-shadow: 0 0 6px rgba(255,193,7,0.2); border-color: rgba(255,193,7,0.3); }
  50%      { box-shadow: 0 0 22px rgba(255,193,7,0.55); border-color: rgba(255,193,7,0.65); }
}
@keyframes phaseGlow {
  0%, 100% { text-shadow: 0 0 4px rgba(255,143,0,0.15); }
  50%      { text-shadow: 0 0 14px rgba(255,143,0,0.55); }
}
@keyframes greetFade {
  0%       { opacity: 0; transform: translateY(-10px); }
  100%     { opacity: 1; transform: translateY(0); }
}
@keyframes leafDrift {
  0%       { transform: translate(0, 0) rotate(0deg); opacity: 0; }
  15%      { opacity: 0.65; }
  50%      { transform: translate(18px, -24px) rotate(120deg); opacity: 0.4; }
  100%     { transform: translate(35px, 12px) rotate(240deg); opacity: 0; }
}
@keyframes grassWave {
  0%, 100% { transform: scaleX(1) skewX(0deg); }
  50%      { transform: scaleX(1.02) skewX(1deg); }
}
@keyframes sunriseGlow {
  0%, 100% { opacity: 0.12; }
  50%      { opacity: 0.22; }
}
@keyframes tapHint {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50%      { opacity: 0.7; transform: scale(1.05); }
}
`;

/* ─── Configuración ──────────────────────────────────────── */
const WEATHER_ICONS: Record<string, string> = {
    SOL: '☀️', LLUVIA: '🌧️', VIENTO: '💨', NOCHE: '🌙', NUBLADO: '☁️',
};

const WEATHER_LABELS: Record<string, string> = {
    SOL: 'Soleado', LLUVIA: 'Lluvioso', VIENTO: 'Ventoso',
    NOCHE: 'Noche despejada', NUBLADO: 'Nublado',
};

const PHASE_CONFIG: Record<string, { icon: string; hint: string; greeting: string; color: string; bgTint: string }> = {
    'MAÑANA': { icon: '🌅', hint: '¡Ve a Expedición a recolectar materiales!', greeting: '¡Buenos días, naturalista!', color: '#FF8F00', bgTint: 'rgba(255,183,77,0.06)' },
    'MEDIODÍA': { icon: '☀️', hint: '¡Fabrica tu Estación de Reclamo en el Taller!', greeting: '¡Buen mediodía!', color: '#FFA000', bgTint: 'rgba(255,193,7,0.05)' },
    'TARDE': { icon: '🌇', hint: '¡Un ave podría estar acercándose!', greeting: '¡Buenas tardes!', color: '#E65100', bgTint: 'rgba(255,111,0,0.05)' },
    'NOCHE': { icon: '🌙', hint: '¡Compite en el Certamen con tus cartas!', greeting: '¡Buenas noches!', color: '#283593', bgTint: 'rgba(63,81,181,0.06)' },
};

const BIRD_EMOJIS: Record<string, string> = {
    'BOSQUE': '🐦', 'MONTAÑA': '🦅', 'AGUA': '🕊️', 'COSTA': '🐧',
};

const BIRD_POSITIONS = [
    { top: 20, left: 16, scale: 1.1 },
    { top: 42, right: 6, scale: 0.95 },
    { top: 65, left: 32, scale: 1.0 },
    { top: 12, right: 22, scale: 0.85 },
    { top: 54, left: 4, scale: 0.9 },
];

/**
 * Pantalla del Santuario (Home)
 *
 * Hub principal de relajación y estado del jugador.
 * Rediseñada con: saludo dinámico, árbol animado con balanceo,
 * suelo con hierba, pájaros variados, interacciones con hop + corazones,
 * partículas de hojas, clima expandido, craft hint pulsante, fase con glow.
 */
export function SantuarioScreen() {
    const { state, dispatch } = useGame();
    const { weather, player, gamePhase } = state;
    const [tappedBird, setTappedBird] = useState<string | null>(null);
    const [selectedBird, setSelectedBird] = useState<BirdCard | null>(null);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [feedMessage, setFeedMessage] = useState<string | null>(null);

    const birdsToShow = player.collection.slice(0, 5);
    const weatherIcon = WEATHER_ICONS[weather.condition] || '☀️';
    const weatherLabel = WEATHER_LABELS[weather.condition] || weather.condition;
    const phaseConfig = PHASE_CONFIG[gamePhase] || PHASE_CONFIG['MAÑANA'];

    // ─── EFFECTS ───────────────────────────────────────────────
    useEffect(() => {
        // Al montar el Santuario, sincronizamos el clima real de Madrid
        // (Opcionalmente, podríamos pedir acceso a Geolocalización aquí)
        const loadRealWeather = async () => {
            try {
                const realWeather = await fetchCurrentWeather(40.4165, -3.7026, 'Madrid');
                dispatch({ type: 'SET_WEATHER', payload: realWeather });
            } catch (error) {
                console.error('No se pudo cargar el clima:', error);
            }
        };

        loadRealWeather();
    }, [dispatch]);

    const canCraft = useMemo(() => {
        const hasPhoto = player.craftItems.some(i => i.type === 'FOTO');
        const hasFeather = player.craftItems.some(i => i.type === 'PLUMA');
        const hasNotes = player.craftItems.some(i => i.type === 'NOTAS');
        return hasPhoto && hasFeather && hasNotes;
    }, [player.craftItems]);

    const collectionProgress = useMemo(() => {
        return Math.round((player.collection.length / 150) * 100);
    }, [player.collection.length]);

    const handleBirdTap = useCallback((birdId: string) => {
        setTappedBird(birdId);
        if (!hasInteracted) setHasInteracted(true);
        // Esperamos un momento para la animación y luego mostramos el modelo
        setTimeout(() => {
            setTappedBird(null);
            const bird = player.collection.find(b => b.id === birdId);
            if (bird) {
                setSelectedBird(bird);
            }
        }, 1000);
    }, [hasInteracted, player.collection]);

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
            <style>{santuarioCSS}</style>

            {/* Tinte sutil según fase del día */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundColor: phaseConfig.bgTint,
                pointerEvents: 'none' as any, zIndex: 5,
                animation: 'sunriseGlow 8s ease-in-out infinite',
            }} />

            {/* ── Panel Superior ────────────────────────────── */}
            <View style={styles.topPanel}>
                {/* Saludo dinámico */}
                <div style={{ animation: 'greetFade 0.7s ease-out' }}>
                    <Text style={styles.greeting}>{phaseConfig.greeting}</Text>
                    <Text style={styles.playerName}>{player.name}</Text>
                </div>

                {/* Tarjeta de clima — layout horizontal */}
                <GlassCard style={styles.weatherCard}>
                    <View style={styles.weatherMain}>
                        <Text style={styles.weatherEmoji}>{weatherIcon}</Text>
                        <View style={styles.weatherInfo}>
                            <Text style={styles.tempText}>{weather.temperature}°C</Text>
                            <Text style={styles.locationText}>📍 {weather.location}</Text>
                        </View>
                        <View style={styles.weatherBadge}>
                            <Text style={styles.conditionText}>{weatherLabel}</Text>
                        </View>
                    </View>
                </GlassCard>

                {/* Recursos en línea */}
                <View style={styles.resourceRow}>
                    <ResourceCounter icon="🌰" value={player.resources.seeds} label="Semillas" />
                    <ResourceCounter icon="📝" value={player.resources.fieldNotes} label="Notas" />
                    <ResourceCounter icon="⭐" value={player.reputation} label="Rep" />
                    <ResourceCounter icon="📖" value={`${collectionProgress}%`} label="Álbum" />
                </View>
            </View>

            {/* ── Zona del Árbol ────────────────────────────── */}
            <View style={styles.treeZone}>
                {/* Partículas de hojas flotantes */}
                {[0, 1, 2, 3, 4].map(i => (
                    <div key={`leaf-${i}`} style={{
                        position: 'absolute',
                        top: `${25 + i * 10}%`,
                        left: `${15 + i * 14}%`,
                        fontSize: i % 2 === 0 ? 14 : 11,
                        animation: `leafDrift ${3.5 + i * 0.8}s ease-in-out ${i * 1.5}s infinite`,
                        pointerEvents: 'none' as any,
                        zIndex: 10,
                    }}>{i % 3 === 0 ? '🍂' : '🍃'}</div>
                ))}

                {/* Glow dorado si puede craftear */}
                {canCraft && (
                    <div style={{
                        position: 'absolute',
                        width: 260, height: 260,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(255,193,7,0.2) 0%, rgba(255,193,7,0) 65%)',
                        animation: 'craftPulse 2.5s ease-in-out infinite',
                        zIndex: 14,
                        pointerEvents: 'none' as any,
                    }} />
                )}

                {/* Árbol con animación + suelo */}
                <div style={{
                    animation: 'treeSway 7s ease-in-out infinite',
                    transformOrigin: 'bottom center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                }}>
                    {/* Copa del árbol */}
                    <div style={{ fontSize: 150, lineHeight: '150px', userSelect: 'none' }}>🌳</div>

                    {/* Suelo con hierba */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        gap: 2,
                        marginTop: -14,
                        animation: 'grassWave 4s ease-in-out infinite',
                    }}>
                        <span style={{ fontSize: 20, opacity: 0.5 }}>🌿</span>
                        <span style={{ fontSize: 16, opacity: 0.4 }}>🌱</span>
                        <span style={{ fontSize: 22, opacity: 0.6 }}>🌿</span>
                        <span style={{ fontSize: 14, opacity: 0.35 }}>🌱</span>
                        <span style={{ fontSize: 18, opacity: 0.5 }}>🌿</span>
                    </div>

                    {/* Sombra del árbol */}
                    <div style={{
                        width: 120, height: 14,
                        borderRadius: '50%',
                        background: 'radial-gradient(ellipse, rgba(0,0,0,0.08) 0%, transparent 70%)',
                        marginTop: -4,
                    }} />
                </div>

                {/* Pájaros en el árbol */}
                {birdsToShow.map((bird, i) => (
                    <BirdOnTree
                        key={bird.id}
                        bird={bird}
                        position={BIRD_POSITIONS[i % BIRD_POSITIONS.length]}
                        isTapped={tappedBird === bird.id}
                        onTap={handleBirdTap}
                        animDelay={i * 0.7}
                    />
                ))}

                {/* Hint "toca un pájaro" — desaparece tras primera interacción */}
                {!hasInteracted && birdsToShow.length > 0 && (
                    <div style={{
                        position: 'absolute', bottom: 12, left: '50%',
                        transform: 'translateX(-50%)',
                        animation: 'tapHint 2.5s ease-in-out infinite',
                        zIndex: 30,
                    }}>
                        <View style={styles.tapHintPill}>
                            <Text style={styles.tapHintText}>👆 Toca un pájaro</Text>
                        </View>
                    </div>
                )}
            </View>

            {/* ── Crafting hint pulsante ────────────────────── */}
            {canCraft && (
                <View style={styles.craftHint}>
                    <div style={{ animation: 'craftPulse 2s ease-in-out infinite', borderRadius: 16 }}>
                        <GlassCard style={styles.craftHintCard}>
                            <Text style={styles.craftHintText}>
                                ✨ ¡Tienes materiales! Ve al Taller a registrar un ave
                            </Text>
                        </GlassCard>
                    </div>
                </View>
            )}

            {/* ── Panel Inferior — Fase del Día ────────────── */}
            <View style={styles.bottomInfo}>
                <GlassCard style={styles.phaseCard}>
                    <View style={styles.phaseHeader}>
                        <div style={{ animation: 'phaseGlow 3s ease-in-out infinite' }}>
                            <Text style={styles.phaseIcon}>{phaseConfig.icon}</Text>
                        </div>
                        <View style={styles.phaseContent}>
                            <Text style={styles.phaseText}>Fase: {gamePhase}</Text>
                            <Text style={styles.phaseHint}>{phaseConfig.hint}</Text>
                        </View>
                    </View>
                    {/* Barra de progreso del día */}
                    <View style={styles.dayBarContainer}>
                        <div style={{
                            height: 3, borderRadius: 2,
                            width: gamePhase === 'MAÑANA' ? '25%' : gamePhase === 'MEDIODÍA' ? '50%' : gamePhase === 'TARDE' ? '75%' : '100%',
                            background: `linear-gradient(90deg, ${phaseConfig.color}, rgba(255,193,7,0.4))`,
                            transition: 'width 0.8s ease',
                        }} />
                    </View>
                </GlassCard>
            </View>

            {/* ── Modal de Detalle de Ave ──────────────────── */}
            <Modal
                visible={!!selectedBird}
                transparent={true}
                animationType="fade"
                onRequestClose={handleCloseModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeModalButton} onPress={handleCloseModal}>
                            <Text style={styles.closeModalText}>✕</Text>
                        </TouchableOpacity>

                        {selectedBird && (
                            <View style={styles.modalInner}>
                                <BirdCardView card={selectedBird} mode="full" />

                                {feedMessage ? (
                                    <View style={styles.feedMessageContainer}>
                                        <Text style={styles.feedMessageText}>{feedMessage}</Text>
                                    </View>
                                ) : (
                                    <TouchableOpacity style={styles.feedButton} onPress={handleFeedBird}>
                                        <Text style={styles.feedButtonText}>🌰 Alimentar (-5 Semillas)</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                    </View>
                </View>
            </Modal>
        </WeatherBackground>
    );
}

/* ─── Componente Pájaro en el Árbol ──────────────────────── */
interface BirdOnTreeProps {
    bird: BirdCard;
    position: { top: number; left?: number; right?: number; scale?: number };
    isTapped: boolean;
    onTap: (id: string) => void;
    animDelay: number;
}

function BirdOnTree({ bird, position, isTapped, onTap, animDelay }: BirdOnTreeProps) {
    const birdScale = position.scale || 1;
    const posStyle: any = {
        top: `${position.top}%`,
        ...(position.left !== undefined ? { left: `${position.left}%` } : { right: `${position.right}%` }),
    };

    const birdEmoji = BIRD_EMOJIS[bird.habitat] || '🐦';

    return (
        <TouchableOpacity
            style={[styles.birdContainer, posStyle]}
            onPress={() => onTap(bird.id)}
            accessibilityLabel={`Pájaro ${bird.name}. Toca para escuchar su canto`}
            accessibilityRole="button"
            accessibilityHint={`${bird.scientificName}. Hábitat: ${bird.habitat}`}
        >
            {/* Pájaro con perch idle / hop al tocar */}
            <div style={{
                animation: isTapped
                    ? 'birdHop 0.6s ease-out'
                    : `birdPerch ${2.8 + animDelay * 0.3}s ease-in-out ${animDelay}s infinite`,
                fontSize: Math.round(34 * birdScale),
                cursor: 'pointer',
                userSelect: 'none',
                filter: isTapped ? 'drop-shadow(0 0 10px rgba(255,193,7,0.8))' : 'none',
                transition: 'filter 0.3s ease',
            }}>
                {birdEmoji}
            </div>

            {/* Nombre pop-in + corazones burst */}
            {isTapped && (
                <View style={styles.heartBubble}>
                    <div style={{ animation: 'namePopIn 0.35s ease-out' }}>
                        <Text style={styles.birdName}>{bird.name}</Text>
                        <Text style={styles.birdScientific}>{bird.scientificName}</Text>
                        <Text style={styles.birdCuriosity}>💡 {bird.curiosity}</Text>
                    </div>
                    <View style={styles.heartsRow}>
                        {[0, 1, 2, 3, 4].map(idx => (
                            <div key={idx} style={{
                                display: 'inline-block',
                                animation: `heartBurst 1.4s ease-out ${idx * 0.1}s forwards`,
                                fontSize: 13,
                            }}>
                                {['❤️', '💛', '💚', '💙', '💜'][idx]}
                            </div>
                        ))}
                    </View>
                </View>
            )}
        </TouchableOpacity>
    );
}

/* ─── Estilos ────────────────────────────────────────────── */
const styles = StyleSheet.create({
    /* Panel Superior */
    topPanel: {
        paddingTop: 44,
        paddingHorizontal: spacing.xl,
        gap: spacing.sm,
        zIndex: 20,
    },
    greeting: {
        fontSize: 11,
        color: colors.text,
        opacity: 0.5,
        fontFamily: typography.fontBody,
        textAlign: 'center',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
    playerName: {
        fontSize: typography.sizeSubtitle,
        fontWeight: typography.weightBold,
        color: colors.text,
        fontFamily: typography.fontTitle,
        textAlign: 'center',
        marginBottom: spacing.xs,
    },
    weatherCard: {
        alignSelf: 'stretch',
    },
    weatherMain: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    weatherEmoji: {
        fontSize: 36,
    },
    weatherInfo: {
        flex: 1,
    },
    tempText: {
        fontSize: 26,
        fontWeight: typography.weightBold,
        color: colors.text,
        fontFamily: typography.fontTitle,
        lineHeight: 30,
    },
    locationText: {
        fontSize: 11,
        color: colors.primaryDark,
        fontFamily: typography.fontBody,
        fontWeight: typography.weightSemiBold,
    },
    weatherBadge: {
        backgroundColor: 'rgba(124, 154, 146, 0.1)',
        borderRadius: borders.radiusFull,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
    },
    conditionText: {
        fontSize: 11,
        color: colors.primary,
        fontWeight: typography.weightSemiBold,
        fontFamily: typography.fontBody,
    },
    resourceRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacing.sm,
        flexWrap: 'wrap',
    },

    /* Zona del Árbol */
    treeZone: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        zIndex: 15,
    },
    birdContainer: {
        position: 'absolute',
        zIndex: 20,
    },
    heartBubble: {
        position: 'absolute',
        top: -72,
        left: -40,
        backgroundColor: colors.glass,
        borderRadius: borders.radiusMedium,
        padding: spacing.sm,
        paddingHorizontal: spacing.md,
        alignItems: 'center',
        minWidth: 140,
        maxWidth: 200,
        //@ts-ignore
        backdropFilter: 'blur(18px)',
        borderWidth: 1,
        borderColor: colors.glassBorder,
        ...shadows.glass,
    },
    birdName: {
        fontSize: typography.sizeCaption,
        fontWeight: typography.weightBold,
        color: colors.text,
        fontFamily: typography.fontTitle,
        textAlign: 'center',
    },
    birdScientific: {
        fontSize: 9,
        color: colors.primaryDark,
        fontStyle: 'italic',
        fontFamily: typography.fontBody,
        textAlign: 'center',
        marginBottom: 2,
    },
    birdCuriosity: {
        fontSize: 9,
        color: colors.text,
        opacity: 0.6,
        fontFamily: typography.fontBody,
        textAlign: 'center',
        marginBottom: 4,
    },
    heartsRow: {
        flexDirection: 'row',
        gap: 2,
    },

    /* Tap hint */
    tapHintPill: {
        backgroundColor: colors.glass,
        borderRadius: borders.radiusFull,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderWidth: 1,
        borderColor: colors.glassBorder,
        //@ts-ignore
        backdropFilter: 'blur(12px)',
    },
    tapHintText: {
        fontSize: 11,
        color: colors.text,
        opacity: 0.6,
        fontFamily: typography.fontBody,
    },

    /* Crafting hint */
    craftHint: {
        paddingHorizontal: spacing.xl,
        zIndex: 20,
    },
    craftHintCard: {
        alignItems: 'center',
        borderWidth: 1,
        //@ts-ignore
        borderColor: 'rgba(255, 193, 7, 0.4)',
    },
    craftHintText: {
        fontSize: typography.sizeCaption,
        color: '#FF8F00',
        fontWeight: typography.weightSemiBold,
        fontFamily: typography.fontBody,
        textAlign: 'center',
    },

    /* Panel Inferior */
    bottomInfo: {
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.lg,
        zIndex: 20,
    },
    phaseCard: {
        gap: spacing.sm,
    },
    phaseHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    phaseContent: {
        flex: 1,
    },
    phaseIcon: {
        fontSize: 30,
    },
    phaseText: {
        fontSize: typography.sizeBody,
        fontWeight: typography.weightBold,
        color: colors.text,
        fontFamily: typography.fontTitle,
    },
    phaseHint: {
        fontSize: typography.sizeSmall,
        color: colors.primaryDark,
        fontStyle: 'italic',
        fontFamily: typography.fontBody,
    },
    dayBarContainer: {
        height: 3,
        backgroundColor: 'rgba(124, 154, 146, 0.12)',
        borderRadius: 2,
        overflow: 'hidden',
    },

    /* Modal */
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.md,
    },
    modalContent: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: colors.background,
        borderRadius: borders.radiusLarge,
        padding: spacing.xl,
        position: 'relative',
        ...shadows.glass,
    },
    modalInner: {
        alignItems: 'center',
        gap: spacing.lg,
    },
    closeModalButton: {
        position: 'absolute',
        top: spacing.md,
        right: spacing.md,
        zIndex: 50,
        backgroundColor: colors.background,
        borderRadius: borders.radiusFull,
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.card,
    },
    closeModalText: {
        fontSize: 18,
        color: colors.text,
        fontWeight: typography.weightBold,
    },
    feedButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        borderRadius: borders.radiusFull,
        width: '100%',
        alignItems: 'center',
        ...shadows.card,
    },
    feedButtonText: {
        color: colors.white,
        fontSize: typography.sizeBody,
        fontWeight: typography.weightBold,
        fontFamily: typography.fontBody,
    },
    feedMessageContainer: {
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        borderRadius: borders.radiusFull,
        backgroundColor: 'rgba(124, 154, 146, 0.15)',
        width: '100%',
        alignItems: 'center',
    },
    feedMessageText: {
        color: colors.primaryDark,
        fontSize: typography.sizeBody,
        fontWeight: typography.weightSemiBold,
        fontFamily: typography.fontBody,
    },
});
