/**
 * AVIS — Pantalla Cooperativa
 * Invitaciones, entrenamiento cooperativo, expediciones en grupo.
 */
import React, { useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { GlassCard } from '../components/GlassCard';
import { useCoop } from '../context/CoopContext';
import { CoopTab, Invitation, TrainingSession, CoopExpedition } from '../types/coop';
import { colors, typography, spacing, borders, shadows } from '../theme/theme';

// CSS animations
const coopAnimCSS = `
@keyframes slideIn {
  0%   { opacity: 0; transform: translateX(-15px); }
  100% { opacity: 1; transform: translateX(0); }
}
@keyframes progressPulse {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.7; }
}
@keyframes boostPop {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.15); }
  100% { transform: scale(1); }
}
`;

const TABS: { type: CoopTab; label: string; icon: string }[] = [
    { type: 'INVITATIONS', label: 'Invitaciones', icon: '✉️' },
    { type: 'TRAINING', label: 'Entrenamiento', icon: '💪' },
    { type: 'EXPEDITIONS', label: 'Expediciones', icon: '🔭' },
];

// ─── SUBCOMPONENTES ────────────────────────────────────────

function InvitationCard({ inv, onAccept, onDecline, index }: {
    inv: Invitation; onAccept: (id: string) => void; onDecline: (id: string) => void; index: number;
}) {
    const typeIcons: Record<string, string> = {
        COOP_EXPEDITION: '🔭', TRAINING: '💪', TRADE_REQUEST: '🔄', FLOCK_INVITE: '🦅',
    };
    const typeLabels: Record<string, string> = {
        COOP_EXPEDITION: 'Expedición Coop.', TRAINING: 'Entrenamiento', TRADE_REQUEST: 'Intercambio', FLOCK_INVITE: 'Bandada',
    };
    const timeAgo = (() => {
        const d = Date.now() - new Date(inv.timestamp).getTime();
        return d < 60000 ? 'Ahora' : d < 3600000 ? `${Math.floor(d / 60000)} min` : `${Math.floor(d / 3600000)}h`;
    })();

    const isPending = inv.status === 'PENDING';

    return (
        <div style={{ animation: `slideIn 0.3s ease-out ${index * 0.08}s both` }}>
            <GlassCard style={[styles.invCard, !isPending && styles.invCardDone]}>
                <View style={styles.invHeader}>
                    <Text style={styles.invAvatar}>{inv.fromPlayerAvatar}</Text>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.invName}>{inv.fromPlayerName}</Text>
                        <Text style={styles.invType}>{typeIcons[inv.type]} {typeLabels[inv.type]} · {timeAgo}</Text>
                    </View>
                    {!isPending && (
                        <Text style={[styles.statusBadge, inv.status === 'ACCEPTED' ? styles.statusAccepted : styles.statusDeclined]}>
                            {inv.status === 'ACCEPTED' ? '✅' : '❌'}
                        </Text>
                    )}
                </View>
                <Text style={styles.invMessage}>{inv.message}</Text>
                {isPending && (
                    <View style={styles.invActions}>
                        <TouchableOpacity style={styles.acceptBtn} onPress={() => onAccept(inv.id)} accessibilityLabel="Aceptar invitación">
                            <Text style={styles.acceptText}>✅ Aceptar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.declineBtn} onPress={() => onDecline(inv.id)} accessibilityLabel="Rechazar invitación">
                            <Text style={styles.declineText}>❌ Rechazar</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </GlassCard>
        </div>
    );
}

function TrainingCard({ session, onBoost }: { session: TrainingSession; onBoost: (id: string) => void; }) {
    const typeLabels: Record<string, string> = {
        ATTACK_BOOST: '⚔️ Ataque', DEFENSE_BOOST: '🛡️ Defensa', POSTURE_UNLOCK: '🎭 Postura',
    };
    const hoursLeft = Math.max(0, Math.floor((new Date(session.completesAt).getTime() - Date.now()) / 3600000));

    return (
        <GlassCard style={styles.trainCard}>
            <View style={styles.trainHeader}>
                <Text style={styles.trainBird}>{session.birdCard.photo}</Text>
                <View style={{ flex: 1 }}>
                    <Text style={styles.trainName}>{session.birdCard.name}</Text>
                    <Text style={styles.trainType}>{typeLabels[session.trainingType]}</Text>
                    <Text style={styles.trainParticipants}>
                        👥 {session.participantNames.join(', ')}
                    </Text>
                </View>
            </View>

            <View style={styles.trainProgressRow}>
                <View style={styles.trainProgressBar}>
                    <div style={{
                        height: 10, borderRadius: 5,
                        width: `${session.progress}%`,
                        background: session.isComplete
                            ? 'linear-gradient(90deg, #4CAF50, #66BB6A)'
                            : 'linear-gradient(90deg, #7C9A92, #A8C5B8)',
                        transition: 'width 0.5s ease',
                        ...(session.isComplete ? {} : { animation: 'progressPulse 2s ease-in-out infinite' }),
                    }} />
                </View>
                <Text style={styles.trainProgress}>{session.progress}%</Text>
            </View>

            {session.isComplete ? (
                <View style={styles.trainComplete}>
                    <Text style={styles.trainCompleteText}>🏆 ¡Entrenamiento completado!</Text>
                </View>
            ) : (
                <View style={styles.trainFooter}>
                    <Text style={styles.trainTimer}>⏳ {hoursLeft}h restantes</Text>
                    <TouchableOpacity style={styles.boostBtn} onPress={() => onBoost(session.id)} accessibilityLabel="Impulsar entrenamiento">
                        <Text style={styles.boostText}>⚡ Impulsar</Text>
                    </TouchableOpacity>
                </View>
            )}
        </GlassCard>
    );
}

function CoopExpeditionCard({ exp, onJoin, onStart }: {
    exp: CoopExpedition; onJoin: (id: string) => void; onStart: (id: string) => void;
}) {
    const biomeIcons: Record<string, string> = {
        'BOSQUE': '🌲', 'MONTAÑA': '🏔️', 'COSTA': '🏖️', 'PRADERA': '🌾', 'HUMEDAL': '🐸',
    };
    const isJoined = exp.participants.some((p) => p.playerId === 'user-1');
    const isFull = exp.participants.length >= exp.maxParticipants;

    return (
        <GlassCard style={styles.coopCard}>
            <View style={styles.coopHeader}>
                <Text style={styles.coopBiome}>{biomeIcons[exp.biome] || '🗺️'}</Text>
                <View style={{ flex: 1 }}>
                    <Text style={styles.coopName}>Expedición {exp.biome}</Text>
                    <Text style={styles.coopBonus}>🎯 Bonus ×{exp.bonusMultiplier}</Text>
                </View>
                <Text style={[styles.coopStatus,
                exp.status === 'COMPLETED' && styles.coopCompleted,
                exp.status === 'IN_PROGRESS' && styles.coopInProgress,
                ]}>
                    {exp.status === 'WAITING' ? '⏳ Esperando' : exp.status === 'IN_PROGRESS' ? '🔄 En curso' : '✅ Completada'}
                </Text>
            </View>

            {/* Participants */}
            <View style={styles.coopParticipants}>
                {exp.participants.map((p, i) => (
                    <View key={i} style={styles.participantChip}>
                        <Text style={{ fontSize: 14 }}>{p.playerAvatar}</Text>
                        <Text style={styles.participantName}>{p.playerName}</Text>
                    </View>
                ))}
                {Array.from({ length: exp.maxParticipants - exp.participants.length }).map((_, i) => (
                    <View key={`empty-${i}`} style={[styles.participantChip, styles.emptySlot]}>
                        <Text style={styles.emptySlotText}>+</Text>
                    </View>
                ))}
            </View>

            {/* Rewards */}
            {exp.rewards && (
                <View style={styles.rewardsRow}>
                    {exp.rewards.map((r, i) => (
                        <Text key={i} style={styles.rewardText}>🎁 {r.quantity}x {r.type}</Text>
                    ))}
                </View>
            )}

            {/* Actions */}
            {exp.status === 'WAITING' && (
                <View style={styles.coopActions}>
                    {!isJoined && !isFull && (
                        <TouchableOpacity style={styles.joinBtn} onPress={() => onJoin(exp.id)} accessibilityLabel="Unirse a expedición">
                            <Text style={styles.joinText}>🤝 Unirse</Text>
                        </TouchableOpacity>
                    )}
                    {isJoined && (
                        <TouchableOpacity style={styles.startBtn} onPress={() => onStart(exp.id)} accessibilityLabel="Iniciar expedición">
                            <Text style={styles.startText}>🚀 Iniciar</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </GlassCard>
    );
}

// ─── PANTALLA PRINCIPAL ────────────────────────────────────
export function CoopScreen() {
    const { state, setTab, acceptInvitation, declineInvitation, joinCoopExpedition, startCoopExpedition, boostTraining } = useCoop();
    const { invitations, trainingSessions, coopExpeditions, activeTab } = state;

    const pendingCount = invitations.filter((i) => i.status === 'PENDING').length;

    return (
        <View style={styles.container}>
            <style>{coopAnimCSS}</style>

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerEmoji}>🤝</Text>
                <View>
                    <Text style={styles.headerTitle}>Cooperación</Text>
                    <Text style={styles.headerSubtitle}>Juega con otros naturalistas</Text>
                </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabRow}>
                {TABS.map((tab) => {
                    const isActive = activeTab === tab.type;
                    const badge = tab.type === 'INVITATIONS' ? pendingCount : 0;
                    return (
                        <TouchableOpacity
                            key={tab.type}
                            style={[styles.tab, isActive && styles.tabActive]}
                            onPress={() => setTab(tab.type)}
                            accessibilityLabel={`Ver ${tab.label}`}
                        >
                            <Text style={styles.tabIcon}>{tab.icon}</Text>
                            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                                {tab.label}
                            </Text>
                            {badge > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{badge}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {activeTab === 'INVITATIONS' && (
                    invitations.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={{ fontSize: 48, opacity: 0.4 }}>✉️</Text>
                            <Text style={styles.emptyText}>Sin invitaciones</Text>
                        </View>
                    ) : (
                        invitations.map((inv, idx) => (
                            <InvitationCard key={inv.id} inv={inv} onAccept={acceptInvitation} onDecline={declineInvitation} index={idx} />
                        ))
                    )
                )}

                {activeTab === 'TRAINING' && (
                    trainingSessions.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={{ fontSize: 48, opacity: 0.4 }}>💪</Text>
                            <Text style={styles.emptyText}>Sin entrenamientos activos</Text>
                        </View>
                    ) : (
                        trainingSessions.map((s) => (
                            <TrainingCard key={s.id} session={s} onBoost={boostTraining} />
                        ))
                    )
                )}

                {activeTab === 'EXPEDITIONS' && (
                    coopExpeditions.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={{ fontSize: 48, opacity: 0.4 }}>🔭</Text>
                            <Text style={styles.emptyText}>Sin expediciones cooperativas</Text>
                        </View>
                    ) : (
                        coopExpeditions.map((e) => (
                            <CoopExpeditionCard key={e.id} exp={e} onJoin={joinCoopExpedition} onStart={startCoopExpedition} />
                        ))
                    )
                )}
            </ScrollView>
        </View>
    );
}

// ─── ESTILOS ───────────────────────────────────────────────
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, paddingTop: 48 },

    // Header
    header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, marginBottom: spacing.md },
    headerEmoji: { fontSize: 32 },
    headerTitle: { fontSize: typography.sizeTitle, fontWeight: typography.weightBold, color: colors.text, fontFamily: typography.fontTitle },
    headerSubtitle: { fontSize: typography.sizeSmall, color: colors.text, opacity: 0.6, fontFamily: typography.fontBody },

    // Tabs
    tabRow: { flexDirection: 'row', paddingHorizontal: spacing.lg, gap: spacing.sm, marginBottom: spacing.md },
    tab: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: spacing.xs, paddingVertical: spacing.sm, borderRadius: borders.radiusFull, backgroundColor: colors.glass,
    },
    tabActive: { backgroundColor: 'rgba(124, 154, 146, 0.15)', borderWidth: 1, borderColor: colors.primary },
    tabIcon: { fontSize: 14 },
    tabLabel: { fontSize: 11, color: colors.text, opacity: 0.6, fontFamily: typography.fontBody },
    tabLabelActive: { opacity: 1, color: colors.primary, fontWeight: typography.weightBold },
    badge: { backgroundColor: colors.danger, borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', marginLeft: 2 },
    badgeText: { fontSize: 9, color: '#FFF', fontWeight: typography.weightBold },

    content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, gap: spacing.md },

    // Invitation
    invCard: { gap: spacing.sm },
    invCardDone: { opacity: 0.5 },
    invHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    invAvatar: { fontSize: 28 },
    invName: { fontSize: typography.sizeBody, fontWeight: typography.weightBold, color: colors.text, fontFamily: typography.fontBody },
    invType: { fontSize: typography.sizeSmall, color: colors.text, opacity: 0.6, fontFamily: typography.fontBody },
    invMessage: { fontSize: typography.sizeBody, color: colors.text, fontFamily: typography.fontBody, fontStyle: 'italic' },
    invActions: { flexDirection: 'row', gap: spacing.md },
    acceptBtn: { flex: 1, backgroundColor: 'rgba(76, 175, 80, 0.15)', borderRadius: borders.radiusFull, paddingVertical: spacing.sm, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(76, 175, 80, 0.3)' },
    acceptText: { fontSize: typography.sizeSmall, color: '#4CAF50', fontWeight: typography.weightBold },
    declineBtn: { flex: 1, backgroundColor: 'rgba(200, 80, 80, 0.1)', borderRadius: borders.radiusFull, paddingVertical: spacing.sm, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(200, 80, 80, 0.2)' },
    declineText: { fontSize: typography.sizeSmall, color: colors.danger },
    statusBadge: { fontSize: 18 },
    statusAccepted: {},
    statusDeclined: {},

    // Training
    trainCard: { gap: spacing.md },
    trainHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    trainBird: { fontSize: 32 },
    trainName: { fontSize: typography.sizeBody, fontWeight: typography.weightBold, color: colors.text, fontFamily: typography.fontTitle },
    trainType: { fontSize: typography.sizeSmall, color: colors.primary, fontWeight: typography.weightBold },
    trainParticipants: { fontSize: typography.sizeSmall, color: colors.text, opacity: 0.5 },
    trainProgressRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    trainProgressBar: { flex: 1, height: 10, backgroundColor: 'rgba(124, 154, 146, 0.15)', borderRadius: 5, overflow: 'hidden' },
    trainProgress: { fontSize: typography.sizeSmall, fontWeight: typography.weightBold, color: colors.primary, minWidth: 36, textAlign: 'right' as any },
    trainComplete: { alignItems: 'center', paddingVertical: spacing.sm },
    trainCompleteText: { fontSize: typography.sizeBody, color: '#4CAF50', fontWeight: typography.weightBold },
    trainFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    trainTimer: { fontSize: typography.sizeSmall, color: colors.text, opacity: 0.5 },
    boostBtn: { backgroundColor: 'rgba(255, 193, 7, 0.15)', borderRadius: borders.radiusFull, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderWidth: 1, borderColor: 'rgba(255, 193, 7, 0.3)' },
    boostText: { fontSize: typography.sizeSmall, color: '#F9A825', fontWeight: typography.weightBold },

    // Coop Expedition
    coopCard: { gap: spacing.md },
    coopHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    coopBiome: { fontSize: 28 },
    coopName: { fontSize: typography.sizeBody, fontWeight: typography.weightBold, color: colors.text, fontFamily: typography.fontTitle },
    coopBonus: { fontSize: typography.sizeSmall, color: colors.primary, fontWeight: typography.weightBold },
    coopStatus: { fontSize: 11, color: colors.text, opacity: 0.6 },
    coopCompleted: { color: '#4CAF50' },
    coopInProgress: { color: '#FF9800' },
    coopParticipants: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
    participantChip: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: 'rgba(124, 154, 146, 0.1)', borderRadius: borders.radiusFull,
        paddingHorizontal: spacing.sm, paddingVertical: 4,
    },
    participantName: { fontSize: 11, color: colors.text, fontFamily: typography.fontBody },
    emptySlot: { backgroundColor: 'rgba(124, 154, 146, 0.05)', borderWidth: 1, borderColor: colors.glassBorder, borderStyle: 'dashed' },
    emptySlotText: { fontSize: 14, color: colors.text, opacity: 0.3 },
    rewardsRow: { flexDirection: 'row', gap: spacing.md },
    rewardText: { fontSize: typography.sizeSmall, color: '#DAA520', fontWeight: typography.weightBold },
    coopActions: { flexDirection: 'row', gap: spacing.md },
    joinBtn: { flex: 1, backgroundColor: 'rgba(124, 154, 146, 0.15)', borderRadius: borders.radiusFull, paddingVertical: spacing.sm, alignItems: 'center', borderWidth: 1, borderColor: colors.primary },
    joinText: { fontSize: typography.sizeSmall, color: colors.primary, fontWeight: typography.weightBold },
    startBtn: { flex: 1, backgroundColor: colors.primary, borderRadius: borders.radiusFull, paddingVertical: spacing.sm, alignItems: 'center' },
    startText: { fontSize: typography.sizeSmall, color: colors.white, fontWeight: typography.weightBold },

    // Empty
    emptyState: { alignItems: 'center', paddingVertical: spacing.huge, gap: spacing.sm },
    emptyText: { fontSize: typography.sizeBody, color: colors.text, opacity: 0.5, fontStyle: 'italic', fontFamily: typography.fontBody },
});
