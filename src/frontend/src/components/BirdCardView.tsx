import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { BirdCard, PostureType } from '../types/types';
import { colors, typography, spacing, borders, shadows } from '../theme/theme';

interface BirdCardViewProps {
    card: BirdCard;
    mode: 'mini' | 'full';
    onPress?: () => void;
}

/**
 * Componente visual de carta de ave.
 * - Modo "mini": para inventario/rejilla (card pequeña)
 * - Modo "full": para detalle del Álbum (card grande con flip)
 */
export function BirdCardView({ card, mode, onPress }: BirdCardViewProps) {
    const [showBack, setShowBack] = useState(false);

    if (mode === 'mini') {
        return (
            <TouchableOpacity
                style={styles.miniCard}
                onPress={onPress}
                accessibilityRole="button"
                accessibilityLabel={`Carta de ${card.name}`}
            >
                <Image source={{ uri: card.photo }} style={styles.miniImage} />
                <View style={styles.levelBadgeMini}>
                    <Text style={styles.levelTextMini}>Nf. {card.level}</Text>
                </View>
                <View style={styles.miniInfo}>
                    <Text style={styles.miniName} numberOfLines={1}>{card.name}</Text>
                    <View style={styles.miniCostBadge}>
                        <Text style={styles.miniCostText}>🌰 {card.cost}</Text>
                    </View>
                </View>
                <PostureBadge posture={card.preferredPosture} size="small" />
            </TouchableOpacity>
        );
    }

    // Modo Full
    return (
        <View style={styles.fullCard}>
            {!showBack ? (
                // ─── CARA A (Juego/Stats) ─────────────────────
                <View style={styles.faceA}>
                    <Image source={{ uri: card.photo }} style={styles.fullImage} />
                    <View style={styles.fullContent}>
                        <View style={styles.nameRow}>
                            <Text style={styles.fullName}>{card.name}</Text>
                            <View style={styles.levelBadgeFull}>
                                <Text style={styles.levelTextFull}>Nivel {card.level}</Text>
                            </View>
                        </View>
                        <View style={styles.xpBarContainer}>
                            <View style={[styles.xpBarFill, { width: `${(card.xp / card.xpToNextLevel) * 100}%` }]} />
                            <Text style={styles.xpText}>{card.xp} / {card.xpToNextLevel} XP</Text>
                        </View>
                        <View style={styles.costRow}>
                            <Text style={styles.costLabel}>🌰 Coste: {card.cost}</Text>
                            <PostureBadge posture={card.preferredPosture} size="large" />
                        </View>
                        <View style={styles.statsRow}>
                            <StatIcon label="ATK" value={card.stats.attack} color={colors.secondary} />
                            <StatIcon label="DEF" value={card.stats.defense} color={colors.primary} />
                            <StatIcon label="VEL" value={card.stats.speed} color={colors.vuelo} />
                        </View>
                        <Text style={styles.abilityText}>⚡ {card.passiveAbility}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.flipButton}
                        onPress={() => setShowBack(true)}
                        accessibilityLabel="Girar carta para ver datos educativos"
                    >
                        <Text style={styles.flipButtonText}>🔄</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                // ─── CARA B (Educativa) ───────────────────────
                <View style={styles.faceB}>
                    <View style={styles.faceBContent}>
                        <Text style={styles.scientificName}>{card.scientificName}</Text>
                        <Text style={styles.commonNameBack}>{card.name}</Text>
                        <View style={styles.divider} />
                        <Text style={styles.habitatLabel}>🏔️ Hábitat: {card.habitat}</Text>
                        <Text style={styles.curiosityText}>📖 {card.curiosity}</Text>
                        {card.songUrl && (
                            <TouchableOpacity
                                style={styles.songButton}
                                accessibilityLabel={`Escuchar el canto de ${card.name}`}
                            >
                                <Text style={styles.songButtonText}>🔊 Escuchar Canto</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <TouchableOpacity
                        style={styles.flipButton}
                        onPress={() => setShowBack(false)}
                        accessibilityLabel="Volver a los stats de juego"
                    >
                        <Text style={styles.flipButtonText}>🔄</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

// ─── SUBCOMPONENTES ──────────────────────────────────────────

function PostureBadge({ posture, size }: { posture: PostureType; size: 'small' | 'large' }) {
    const config = {
        CANTO: { icon: '🎤', color: colors.canto, label: 'Canto' },
        PLUMAJE: { icon: '🪶', color: colors.plumaje, label: 'Plumaje' },
        VUELO: { icon: '💨', color: colors.vuelo, label: 'Vuelo' },
    };
    const c = config[posture];
    const isSmall = size === 'small';

    return (
        <View style={[styles.postureBadge, { backgroundColor: c.color }, isSmall && styles.postureBadgeSmall]}>
            <Text style={isSmall ? styles.postureBadgeIconSmall : styles.postureBadgeIcon}>{c.icon}</Text>
            {!isSmall && <Text style={styles.postureBadgeLabel}>{c.label}</Text>}
        </View>
    );
}

function StatIcon({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <View style={styles.statContainer}>
            <Text style={[styles.statValue, { color }]}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

// ─── ESTILOS ─────────────────────────────────────────────────
const styles = StyleSheet.create({
    // Mini Card
    miniCard: {
        backgroundColor: colors.background,
        borderRadius: borders.radiusMedium,
        overflow: 'hidden',
        width: 150,
        ...shadows.card,
    },
    miniImage: {
        width: '100%' as any,
        height: 120,
        backgroundColor: colors.primaryLight,
    },
    miniInfo: {
        padding: spacing.sm,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    miniName: {
        fontSize: typography.sizeCaption,
        fontWeight: typography.weightSemiBold,
        color: colors.text,
        flex: 1,
        fontFamily: typography.fontBody,
    },
    miniCostBadge: {
        backgroundColor: colors.glass,
        borderRadius: borders.radiusFull,
        paddingHorizontal: spacing.xs,
        paddingVertical: 2,
    },
    miniCostText: {
        fontSize: typography.sizeSmall,
        color: colors.secondary,
        fontWeight: typography.weightBold,
    },

    // Full Card
    fullCard: {
        backgroundColor: colors.background,
        borderRadius: borders.radiusLarge,
        overflow: 'hidden',
        width: '100%' as any,
        maxWidth: 360,
        alignSelf: 'center',
        ...shadows.glass,
    },

    // Face A
    faceA: {
        position: 'relative',
    },
    fullImage: {
        width: '100%' as any,
        height: 250,
        backgroundColor: colors.primaryLight,
    },
    fullContent: {
        padding: spacing.lg,
        gap: spacing.md,
    },
    fullName: {
        fontSize: typography.sizeTitle,
        fontWeight: typography.weightBold,
        color: colors.text,
        fontFamily: typography.fontTitle,
    },
    costRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    costLabel: {
        fontSize: typography.sizeBody,
        color: colors.secondary,
        fontWeight: typography.weightSemiBold,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: spacing.sm,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.primaryLight + '40',
        marginVertical: spacing.xs,
    },
    // Niveles y XP
    levelBadgeMini: {
        position: 'absolute',
        top: spacing.xs,
        left: spacing.xs,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: borders.radiusSmall,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    levelTextMini: {
        color: colors.white,
        fontSize: 10,
        fontWeight: 'bold',
    },
    nameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    levelBadgeFull: {
        backgroundColor: colors.primary,
        borderRadius: borders.radiusSmall,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    levelTextFull: {
        color: colors.white,
        fontSize: typography.sizeCaption,
        fontWeight: 'bold',
    },
    xpBarContainer: {
        height: 12,
        backgroundColor: colors.primaryLight + '40',
        borderRadius: borders.radiusFull,
        overflow: 'hidden',
        position: 'relative',
        justifyContent: 'center',
        marginVertical: spacing.xs,
    },
    xpBarFill: {
        height: '100%',
        backgroundColor: colors.secondary,
        borderRadius: borders.radiusFull,
    },
    xpText: {
        position: 'absolute',
        width: '100%',
        textAlign: 'center',
        fontSize: 8,
        color: colors.text,
        fontWeight: 'bold',
    },
    abilityText: {
        fontSize: typography.sizeCaption,
        color: colors.text,
        fontStyle: 'italic',
        opacity: 0.8,
        fontFamily: typography.fontBody,
    },

    // Face B
    faceB: {
        position: 'relative',
        backgroundColor: '#F5E6D0', // Papel antiguo
        minHeight: 400,
    },
    faceBContent: {
        padding: spacing.xl,
        gap: spacing.md,
    },
    scientificName: {
        fontSize: typography.sizeSubtitle,
        fontStyle: 'italic',
        color: colors.primaryDark,
        fontFamily: typography.fontTitle,
    },
    commonNameBack: {
        fontSize: typography.sizeTitle,
        fontWeight: typography.weightBold,
        color: colors.text,
        fontFamily: typography.fontTitle,
    },
    divider: {
        height: 1,
        backgroundColor: colors.secondaryLight,
        marginVertical: spacing.sm,
    },
    habitatLabel: {
        fontSize: typography.sizeBody,
        color: colors.text,
        fontFamily: typography.fontBody,
    },
    curiosityText: {
        fontSize: typography.sizeBody,
        color: colors.text,
        lineHeight: 24,
        fontFamily: typography.fontBody,
    },
    songButton: {
        backgroundColor: colors.primary,
        borderRadius: borders.radiusFull,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        alignSelf: 'center',
        marginTop: spacing.md,
    },
    songButtonText: {
        color: colors.white,
        fontSize: typography.sizeBody,
        fontWeight: typography.weightBold,
        fontFamily: typography.fontBody,
    },

    // Flip Button
    flipButton: {
        position: 'absolute',
        top: spacing.md,
        right: spacing.md,
        backgroundColor: colors.glass,
        borderRadius: borders.radiusFull,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.glassBorder,
        //@ts-ignore
        backdropFilter: 'blur(10px)',
    },
    flipButtonText: {
        fontSize: 20,
    },

    // Posture Badge
    postureBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: borders.radiusFull,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        gap: spacing.xs,
    },
    postureBadgeSmall: {
        position: 'absolute',
        top: spacing.xs,
        right: spacing.xs,
        paddingHorizontal: spacing.xs,
        paddingVertical: 2,
    },
    postureBadgeIcon: {
        fontSize: typography.sizeBody,
    },
    postureBadgeIconSmall: {
        fontSize: typography.sizeSmall,
    },
    postureBadgeLabel: {
        color: colors.white,
        fontSize: typography.sizeCaption,
        fontWeight: typography.weightBold,
    },

    // Stat
    statContainer: {
        alignItems: 'center',
        gap: 2,
    },
    statValue: {
        fontSize: typography.sizeTitle,
        fontWeight: typography.weightBold,
    },
    statLabel: {
        fontSize: typography.sizeSmall,
        color: colors.text,
        opacity: 0.6,
        fontFamily: typography.fontBody,
    },
});
