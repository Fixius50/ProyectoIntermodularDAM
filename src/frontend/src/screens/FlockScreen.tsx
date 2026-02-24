/**
 * AVIS — Pantalla de Bandada (Flock)
 * Módulo social: chat en tiempo real, miembros, eventos comunitarios.
 */
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { GlassCard } from '../components/GlassCard';
import { useFlock } from '../context/FlockContext';
import { FlockTab, FlockMember, ChatMessage, CommunityEvent } from '../types/social';
import { colors, typography, spacing, borders, shadows } from '../theme/theme';

// CSS animations
const flockAnimCSS = `
@keyframes messageSlideIn {
  0%   { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes onlinePulse {
  0%, 100% { box-shadow: 0 0 2px #4CAF50; }
  50%      { box-shadow: 0 0 8px #4CAF50; }
}
@keyframes progressFill {
  0%   { width: 0%; }
  100% { width: var(--progress); }
}
@keyframes eventGlow {
  0%, 100% { box-shadow: 0 0 4px rgba(124, 154, 146, 0.1); }
  50%      { box-shadow: 0 0 12px rgba(124, 154, 146, 0.3); }
}
`;

const TABS: { type: FlockTab; label: string; icon: string }[] = [
    { type: 'CHAT', label: 'Chat', icon: '💬' },
    { type: 'MEMBERS', label: 'Miembros', icon: '👥' },
    { type: 'EVENTS', label: 'Eventos', icon: '🎯' },
];

// ─── SUBCOMPONENTES ────────────────────────────────────────

/** Burbuja de mensaje de chat */
function ChatBubble({ msg, isOwnMessage }: { msg: ChatMessage; isOwnMessage: boolean }) {
    const time = new Date(msg.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    const isTip = msg.type === 'TIP';

    return (
        <div style={{ animation: 'messageSlideIn 0.3s ease-out' }}>
            <View style={[
                styles.bubbleRow,
                isOwnMessage && styles.bubbleRowOwn,
            ]}>
                {!isOwnMessage && (
                    <Text style={styles.bubbleAvatar}>{msg.senderAvatar}</Text>
                )}
                <View style={[
                    styles.bubble,
                    isOwnMessage ? styles.bubbleOwn : styles.bubbleOther,
                    isTip && styles.bubbleTip,
                ]}>
                    {!isOwnMessage && (
                        <Text style={styles.bubbleSender}>{msg.senderName}</Text>
                    )}
                    {isTip && <Text style={styles.tipLabel}>💡 Consejo</Text>}
                    <Text style={[styles.bubbleText, isOwnMessage && styles.bubbleTextOwn]}>
                        {msg.content}
                    </Text>
                    <Text style={[styles.bubbleTime, isOwnMessage && styles.bubbleTimeOwn]}>
                        {time}
                    </Text>
                </View>
            </View>
        </div>
    );
}

/** Fila de miembro */
function MemberRow({ member }: { member: FlockMember }) {
    const roleIcons: Record<string, string> = { LEADER: '👑', OFFICER: '⭐', MEMBER: '' };
    const timeDiff = Date.now() - new Date(member.lastActive).getTime();
    const lastSeen = timeDiff < 60000 ? 'Ahora' :
        timeDiff < 3600000 ? `Hace ${Math.floor(timeDiff / 60000)} min` :
            `Hace ${Math.floor(timeDiff / 3600000)}h`;

    return (
        <View style={styles.memberRow} accessibilityLabel={`${member.name}, ${member.role}, reputación ${member.reputation}`}>
            <Text style={styles.memberAvatar}>{member.avatar}</Text>
            <View style={styles.memberInfo}>
                <View style={styles.memberNameRow}>
                    <Text style={styles.memberName}>
                        {roleIcons[member.role]} {member.name}
                    </Text>
                    {member.isOnline && (
                        <div style={{ animation: 'onlinePulse 2s ease-in-out infinite' }}>
                            <View style={styles.onlineDot} />
                        </div>
                    )}
                </View>
                <Text style={styles.memberMeta}>
                    🏅 {member.reputation} rep · {member.isOnline ? '🟢 En línea' : `⏰ ${lastSeen}`}
                </Text>
            </View>
        </View>
    );
}

/** Tarjeta de evento */
function EventCard({ event }: { event: CommunityEvent }) {
    const endDate = new Date(event.endDate);
    const hoursLeft = Math.max(0, Math.floor((endDate.getTime() - Date.now()) / 3600000));

    return (
        <div style={{ animation: 'eventGlow 3s ease-in-out infinite' }}>
            <GlassCard style={styles.eventCard}>
                <View style={styles.eventHeader}>
                    <Text style={styles.eventIcon}>
                        {event.type === 'COLLECTION_RACE' ? '🏃' : event.type === 'BOSS_BATTLE' ? '⚔️' : '🔭'}
                    </Text>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.eventName}>{event.name}</Text>
                        <Text style={styles.eventDesc}>{event.description}</Text>
                    </View>
                </View>

                <View style={styles.eventProgressRow}>
                    <View style={styles.eventProgressBar}>
                        <div style={{
                            height: 8, borderRadius: 4,
                            width: `${event.progress}%`,
                            background: 'linear-gradient(90deg, #7C9A92, #A8C5B8)',
                            transition: 'width 0.5s ease',
                        }} />
                    </View>
                    <Text style={styles.eventProgressText}>{event.progress}%</Text>
                </View>

                <View style={styles.eventFooter}>
                    <Text style={styles.eventTimer}>⏳ {hoursLeft}h restantes</Text>
                    <Text style={styles.eventReward}>
                        🎁 {event.rewards.map((r) => r.description).join(', ')}
                    </Text>
                </View>
            </GlassCard>
        </div>
    );
}

// ─── PANTALLA PRINCIPAL ────────────────────────────────────
export function FlockScreen() {
    const { state, setTab, sendMessage, leaveFlock } = useFlock();
    const { flock, messages, activeTab } = state;
    const [chatInput, setChatInput] = useState('');
    const chatScrollRef = useRef<ScrollView>(null);

    // Auto-scroll al final del chat cuando llegan nuevos mensajes
    useEffect(() => {
        if (chatScrollRef.current && activeTab === 'CHAT') {
            setTimeout(() => {
                chatScrollRef.current?.scrollToEnd?.({ animated: true });
            }, 100);
        }
    }, [messages.length, activeTab]);

    const handleSend = useCallback(() => {
        if (!chatInput.trim()) return;
        sendMessage(chatInput);
        setChatInput('');
    }, [chatInput, sendMessage]);

    // Si no tiene bandada → pantalla de búsqueda
    if (!flock) {
        return <NoFlockView />;
    }

    return (
        <View style={styles.container}>
            <style>{flockAnimCSS}</style>

            {/* Header de bandada */}
            <View style={styles.header}>
                <Text style={styles.headerEmoji}>{flock.emblem}</Text>
                <View style={styles.headerInfo}>
                    <Text style={styles.headerName}>{flock.name}</Text>
                    <Text style={styles.headerMeta}>
                        Nivel {flock.level} · {flock.members.length}/{flock.maxMembers} miembros
                    </Text>
                </View>
            </View>

            {/* XP Bar */}
            <View style={styles.xpBarContainer}>
                <div style={{
                    height: 4, borderRadius: 2,
                    width: `${(flock.experience % 300) / 3}%`,
                    background: 'linear-gradient(90deg, #7C9A92, #A8C5B8)',
                    transition: 'width 0.5s ease',
                }} />
            </View>

            {/* Tabs */}
            <View style={styles.tabRow}>
                {TABS.map((tab) => {
                    const isActive = activeTab === tab.type;
                    return (
                        <TouchableOpacity
                            key={tab.type}
                            style={[styles.tab, isActive && styles.tabActive]}
                            onPress={() => setTab(tab.type)}
                            accessibilityLabel={`Ver ${tab.label}`}
                            accessibilityRole="tab"
                        >
                            <Text style={styles.tabIcon}>{tab.icon}</Text>
                            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Content */}
            {activeTab === 'CHAT' && (
                <View style={styles.chatContainer}>
                    <ScrollView
                        ref={chatScrollRef}
                        style={styles.chatScroll}
                        contentContainerStyle={styles.chatContent}
                    >
                        {messages.map((msg) => (
                            <ChatBubble
                                key={msg.id}
                                msg={msg}
                                isOwnMessage={msg.senderId === 'user-1'}
                            />
                        ))}
                    </ScrollView>

                    {/* Input de chat */}
                    <View style={styles.chatInputRow}>
                        <TextInput
                            style={styles.chatInput}
                            value={chatInput}
                            onChangeText={setChatInput}
                            placeholder="Escribe un mensaje..."
                            placeholderTextColor="rgba(74, 56, 42, 0.3)"
                            onSubmitEditing={handleSend}
                            accessibilityLabel="Campo de mensaje"
                        />
                        <TouchableOpacity
                            style={[styles.sendButton, !chatInput.trim() && styles.sendButtonDisabled]}
                            onPress={handleSend}
                            disabled={!chatInput.trim()}
                            accessibilityLabel="Enviar mensaje"
                        >
                            <Text style={styles.sendIcon}>🕊️</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {activeTab === 'MEMBERS' && (
                <ScrollView contentContainerStyle={styles.membersContent}>
                    {flock.members
                        .sort((a, b) => {
                            const roleOrder = { LEADER: 0, OFFICER: 1, MEMBER: 2 };
                            return roleOrder[a.role] - roleOrder[b.role];
                        })
                        .map((member) => (
                            <MemberRow key={member.playerId} member={member} />
                        ))}
                    <TouchableOpacity
                        style={styles.leaveButton}
                        onPress={leaveFlock}
                        accessibilityLabel="Abandonar bandada"
                    >
                        <Text style={styles.leaveButtonText}>🚪 Abandonar Bandada</Text>
                    </TouchableOpacity>
                </ScrollView>
            )}

            {activeTab === 'EVENTS' && (
                <ScrollView contentContainerStyle={styles.eventsContent}>
                    {flock.activeEvents.length === 0 ? (
                        <View style={styles.emptyEvents}>
                            <Text style={styles.emptyEmoji}>🎯</Text>
                            <Text style={styles.emptyText}>No hay eventos activos</Text>
                        </View>
                    ) : (
                        flock.activeEvents.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))
                    )}
                </ScrollView>
            )}
        </View>
    );
}

/** Vista sin bandada */
function NoFlockView() {
    const { searchFlocks, joinFlock, state } = useFlock();
    const [query, setQuery] = useState('');

    const handleSearch = useCallback(() => {
        searchFlocks(query);
    }, [query, searchFlocks]);

    return (
        <View style={styles.container}>
            <style>{flockAnimCSS}</style>
            <View style={styles.noFlockCenter}>
                <Text style={{ fontSize: 56 }}>🦅</Text>
                <Text style={styles.noFlockTitle}>Únete a una Bandada</Text>
                <Text style={styles.noFlockSubtitle}>
                    Comparte estrategia, participa en eventos y progresa con otros naturalistas.
                </Text>

                <View style={styles.searchRow}>
                    <TextInput
                        style={styles.searchInput}
                        value={query}
                        onChangeText={setQuery}
                        placeholder="Buscar bandada..."
                        placeholderTextColor="rgba(74, 56, 42, 0.3)"
                        onSubmitEditing={handleSearch}
                        accessibilityLabel="Buscar bandada"
                    />
                    <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                        <Text style={styles.searchButtonText}>🔍</Text>
                    </TouchableOpacity>
                </View>

                {state.searchResults.length > 0 && (
                    <View style={styles.searchResults}>
                        {state.searchResults.map((flock) => (
                            <TouchableOpacity
                                key={flock.id}
                                style={styles.resultCard}
                                onPress={() => joinFlock(flock.id)}
                                accessibilityLabel={`Unirse a ${flock.name}, nivel ${flock.level}`}
                            >
                                <Text style={styles.resultEmoji}>{flock.emblem}</Text>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.resultName}>{flock.name}</Text>
                                    <Text style={styles.resultMeta}>Nivel {flock.level}</Text>
                                </View>
                                <Text style={styles.joinText}>Unirse →</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>
        </View>
    );
}

// ─── ESTILOS ───────────────────────────────────────────────
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: 48,
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.xs,
    },
    headerEmoji: { fontSize: 36 },
    headerInfo: { flex: 1 },
    headerName: {
        fontSize: typography.sizeTitle,
        fontWeight: typography.weightBold,
        color: colors.text,
        fontFamily: typography.fontTitle,
    },
    headerMeta: {
        fontSize: typography.sizeSmall,
        color: colors.text,
        opacity: 0.6,
        fontFamily: typography.fontBody,
    },

    // XP
    xpBarContainer: {
        marginHorizontal: spacing.lg,
        height: 4,
        backgroundColor: 'rgba(124, 154, 146, 0.15)',
        borderRadius: 2,
        overflow: 'hidden',
        marginBottom: spacing.md,
    },

    // Tabs
    tabRow: {
        flexDirection: 'row',
        paddingHorizontal: spacing.lg,
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
        paddingVertical: spacing.sm,
        borderRadius: borders.radiusFull,
        backgroundColor: colors.glass,
    },
    tabActive: {
        backgroundColor: 'rgba(124, 154, 146, 0.15)',
        borderWidth: 1,
        borderColor: colors.primary,
    },
    tabIcon: { fontSize: 14 },
    tabLabel: {
        fontSize: typography.sizeSmall,
        color: colors.text,
        opacity: 0.6,
        fontFamily: typography.fontBody,
    },
    tabLabelActive: {
        opacity: 1,
        color: colors.primary,
        fontWeight: typography.weightBold,
    },

    // Chat
    chatContainer: { flex: 1 },
    chatScroll: { flex: 1 },
    chatContent: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.md,
        gap: spacing.sm,
    },
    bubbleRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: spacing.sm,
    },
    bubbleRowOwn: {
        flexDirection: 'row-reverse',
    },
    bubbleAvatar: { fontSize: 24 },
    bubble: {
        maxWidth: '75%' as any,
        borderRadius: borders.radiusMedium,
        padding: spacing.md,
    },
    bubbleOwn: {
        backgroundColor: 'rgba(124, 154, 146, 0.15)',
        borderBottomRightRadius: 4,
    },
    bubbleOther: {
        backgroundColor: colors.glass,
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: colors.glassBorder,
    },
    bubbleTip: {
        backgroundColor: 'rgba(124, 154, 146, 0.1)',
        borderWidth: 1,
        borderColor: colors.primary,
    },
    bubbleSender: {
        fontSize: typography.sizeSmall,
        color: colors.primary,
        fontWeight: typography.weightBold,
        fontFamily: typography.fontBody,
        marginBottom: 2,
    },
    tipLabel: {
        fontSize: 10,
        color: colors.primary,
        fontWeight: typography.weightBold,
        marginBottom: 4,
    },
    bubbleText: {
        fontSize: typography.sizeBody,
        color: colors.text,
        fontFamily: typography.fontBody,
    },
    bubbleTextOwn: {
        color: colors.text,
    },
    bubbleTime: {
        fontSize: 9,
        color: colors.text,
        opacity: 0.4,
        textAlign: 'right',
        marginTop: 4,
    },
    bubbleTimeOwn: {
        textAlign: 'left',
    },

    // Chat input
    chatInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.glassBorder,
        backgroundColor: colors.glass,
    },
    chatInput: {
        flex: 1,
        backgroundColor: 'rgba(253, 251, 247, 0.6)',
        borderRadius: borders.radiusFull,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        fontSize: typography.sizeBody,
        color: colors.text,
        fontFamily: typography.fontBody,
        //@ts-ignore
        outlineStyle: 'none',
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendButtonDisabled: { opacity: 0.4 },
    sendIcon: { fontSize: 18 },

    // Members
    membersContent: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xl,
        gap: spacing.sm,
    },
    memberRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        backgroundColor: colors.glass,
        borderRadius: borders.radiusMedium,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.glassBorder,
    },
    memberAvatar: { fontSize: 28 },
    memberInfo: { flex: 1 },
    memberNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    memberName: {
        fontSize: typography.sizeBody,
        fontWeight: typography.weightBold,
        color: colors.text,
        fontFamily: typography.fontBody,
    },
    onlineDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4CAF50',
    },
    memberMeta: {
        fontSize: typography.sizeSmall,
        color: colors.text,
        opacity: 0.5,
        fontFamily: typography.fontBody,
    },
    leaveButton: {
        marginTop: spacing.xl,
        alignItems: 'center',
        padding: spacing.md,
    },
    leaveButtonText: {
        fontSize: typography.sizeBody,
        color: colors.danger,
        fontFamily: typography.fontBody,
    },

    // Events
    eventsContent: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xl,
        gap: spacing.lg,
    },
    eventCard: {
        gap: spacing.md,
    },
    eventHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.md,
    },
    eventIcon: { fontSize: 28 },
    eventName: {
        fontSize: typography.sizeBody,
        fontWeight: typography.weightBold,
        color: colors.text,
        fontFamily: typography.fontTitle,
    },
    eventDesc: {
        fontSize: typography.sizeSmall,
        color: colors.text,
        opacity: 0.7,
        fontFamily: typography.fontBody,
    },
    eventProgressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    eventProgressBar: {
        flex: 1,
        height: 8,
        backgroundColor: 'rgba(124, 154, 146, 0.15)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    eventProgressText: {
        fontSize: typography.sizeSmall,
        fontWeight: typography.weightBold,
        color: colors.primary,
    },
    eventFooter: {
        gap: 4,
    },
    eventTimer: {
        fontSize: typography.sizeSmall,
        color: colors.text,
        opacity: 0.6,
        fontFamily: typography.fontBody,
    },
    eventReward: {
        fontSize: typography.sizeSmall,
        color: colors.primary,
        fontWeight: typography.weightBold,
        fontFamily: typography.fontBody,
    },

    // Empty
    emptyEvents: {
        alignItems: 'center',
        paddingVertical: spacing.huge,
        gap: spacing.sm,
    },
    emptyEmoji: { fontSize: 48, opacity: 0.4 },
    emptyText: {
        fontSize: typography.sizeBody,
        color: colors.text,
        opacity: 0.5,
        fontStyle: 'italic',
        fontFamily: typography.fontBody,
    },

    // No Flock
    noFlockCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        gap: spacing.md,
    },
    noFlockTitle: {
        fontSize: typography.sizeTitle,
        fontWeight: typography.weightBold,
        color: colors.text,
        fontFamily: typography.fontTitle,
        textAlign: 'center',
    },
    noFlockSubtitle: {
        fontSize: typography.sizeBody,
        color: colors.text,
        opacity: 0.6,
        fontFamily: typography.fontBody,
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    searchRow: {
        flexDirection: 'row',
        gap: spacing.sm,
        width: '100%' as any,
        maxWidth: 350,
    },
    searchInput: {
        flex: 1,
        backgroundColor: colors.glass,
        borderRadius: borders.radiusFull,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        fontSize: typography.sizeBody,
        color: colors.text,
        borderWidth: 1,
        borderColor: colors.glassBorder,
        //@ts-ignore
        outlineStyle: 'none',
    },
    searchButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchButtonText: { fontSize: 18 },
    searchResults: {
        width: '100%' as any,
        maxWidth: 350,
        gap: spacing.sm,
        marginTop: spacing.md,
    },
    resultCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        backgroundColor: colors.glass,
        borderRadius: borders.radiusMedium,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.glassBorder,
    },
    resultEmoji: { fontSize: 28 },
    resultName: {
        fontSize: typography.sizeBody,
        fontWeight: typography.weightBold,
        color: colors.text,
        fontFamily: typography.fontBody,
    },
    resultMeta: {
        fontSize: typography.sizeSmall,
        color: colors.text,
        opacity: 0.5,
    },
    joinText: {
        fontSize: typography.sizeSmall,
        color: colors.primary,
        fontWeight: typography.weightBold,
    },
});
