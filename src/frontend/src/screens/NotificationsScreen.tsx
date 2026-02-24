/**
 * AVIS — Pantalla de Notificaciones
 * Centro de notificaciones del juego: logros, recompensas, eventos, sistema.
 */
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { GlassCard } from '../components/GlassCard';
import { colors, typography, spacing, borders } from '../theme/theme';

// CSS Animations
const notifAnimCSS = `
@keyframes notifEnter {
  0%   { opacity: 0; transform: translateX(-12px); }
  100% { opacity: 1; transform: translateX(0); }
}
@keyframes clearPop {
  0%   { transform: scale(1); }
  50%  { transform: scale(0.95); }
  100% { transform: scale(1); }
}
`;

// ─── TIPOS ─────────────────────────────────────────────────
type NotifType = 'ACHIEVEMENT' | 'REWARD' | 'EVENT' | 'SOCIAL' | 'SYSTEM';

interface Notification {
    id: string;
    type: NotifType;
    title: string;
    message: string;
    icon: string;
    timestamp: string;
    read: boolean;
}

// ─── MOCK DATA ─────────────────────────────────────────────
const mockNotifications: Notification[] = [
    { id: 'n1', type: 'ACHIEVEMENT', icon: '🏆', title: '¡Logro desbloqueado!', message: 'Has completado "Observador Experto" — 25 especies descubiertas.', timestamp: new Date(Date.now() - 120000).toISOString(), read: false },
    { id: 'n2', type: 'REWARD', icon: '🎁', title: 'Recompensa diaria', message: 'Has recibido 50 semillas y 5 notas de campo por iniciar sesión.', timestamp: new Date(Date.now() - 300000).toISOString(), read: false },
    { id: 'n3', type: 'SOCIAL', icon: '🦅', title: 'Tu bandada', message: 'Ornitóloga ha compartido un tip estratégico sobre aves de costa.', timestamp: new Date(Date.now() - 600000).toISOString(), read: false },
    { id: 'n4', type: 'EVENT', icon: '🎉', title: 'Evento especial', message: 'El evento "Migración de Primavera" ha comenzado. ¡Especies raras disponibles!', timestamp: new Date(Date.now() - 1800000).toISOString(), read: true },
    { id: 'n5', type: 'SOCIAL', icon: '🤝', title: 'Invitación cooperativa', message: 'Explorador te ha invitado a una expedición en Montaña.', timestamp: new Date(Date.now() - 3600000).toISOString(), read: true },
    { id: 'n6', type: 'SYSTEM', icon: '📢', title: 'Actualización v1.2', message: 'Nuevo bioma "Desierto" disponible. Nuevas cartas legendarias añadidas.', timestamp: new Date(Date.now() - 7200000).toISOString(), read: true },
    { id: 'n7', type: 'REWARD', icon: '💎', title: 'Expedición completada', message: 'Recompensas: 1x Carta Rara + 100 semillas por expedición cooperativa.', timestamp: new Date(Date.now() - 10800000).toISOString(), read: true },
    { id: 'n8', type: 'ACHIEVEMENT', icon: '⚔️', title: '¡Racha victoriosa!', message: 'Has ganado 5 certámenes seguidos. Bonus de reputación ×2.', timestamp: new Date(Date.now() - 14400000).toISOString(), read: true },
];

const FILTER_OPTIONS: { type: NotifType | 'ALL'; label: string; icon: string }[] = [
    { type: 'ALL', label: 'Todas', icon: '📬' },
    { type: 'ACHIEVEMENT', label: 'Logros', icon: '🏆' },
    { type: 'REWARD', label: 'Recompensas', icon: '🎁' },
    { type: 'SOCIAL', label: 'Social', icon: '🤝' },
    { type: 'EVENT', label: 'Eventos', icon: '🎉' },
    { type: 'SYSTEM', label: 'Sistema', icon: '📢' },
];

// ─── SCREEN ────────────────────────────────────────────────
export function NotificationsScreen() {
    const [notifications, setNotifications] = useState(mockNotifications);
    const [filter, setFilter] = useState<NotifType | 'ALL'>('ALL');

    const unreadCount = notifications.filter((n) => !n.read).length;

    const filtered = filter === 'ALL' ? notifications : notifications.filter((n) => n.type === filter);

    const markAllRead = useCallback(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }, []);

    const markRead = useCallback((id: string) => {
        setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    }, []);

    const timeAgo = (ts: string) => {
        const d = Date.now() - new Date(ts).getTime();
        if (d < 60000) return 'Ahora';
        if (d < 3600000) return `${Math.floor(d / 60000)} min`;
        if (d < 86400000) return `${Math.floor(d / 3600000)}h`;
        return `${Math.floor(d / 86400000)}d`;
    };

    const typeColors: Record<NotifType, string> = {
        ACHIEVEMENT: '#DAA520',
        REWARD: '#4CAF50',
        EVENT: '#FF9800',
        SOCIAL: '#7C9A92',
        SYSTEM: '#9E9E9E',
    };

    return (
        <View style={styles.container}>
            <style>{notifAnimCSS}</style>

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.headerEmoji}>🔔</Text>
                    <View>
                        <Text style={styles.headerTitle}>Notificaciones</Text>
                        <Text style={styles.headerSubtitle}>
                            {unreadCount > 0 ? `${unreadCount} sin leer` : 'Todo al día'}
                        </Text>
                    </View>
                </View>
                {unreadCount > 0 && (
                    <TouchableOpacity style={styles.readAllBtn} onPress={markAllRead} accessibilityLabel="Marcar todas como leídas">
                        <Text style={styles.readAllText}>✓ Leer todas</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Filters */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
                {FILTER_OPTIONS.map((f) => (
                    <TouchableOpacity
                        key={f.type}
                        style={[styles.filterChip, filter === f.type && styles.filterActive]}
                        onPress={() => setFilter(f.type)}
                    >
                        <Text style={styles.filterIcon}>{f.icon}</Text>
                        <Text style={[styles.filterLabel, filter === f.type && styles.filterLabelActive]}>{f.label}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Notifications List */}
            <ScrollView contentContainerStyle={styles.list}>
                {filtered.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={{ fontSize: 48, opacity: 0.4 }}>📭</Text>
                        <Text style={styles.emptyText}>Sin notificaciones</Text>
                    </View>
                ) : (
                    filtered.map((n, idx) => (
                        <div key={n.id} style={{ animation: `notifEnter 0.3s ease-out ${idx * 0.06}s both` }}>
                            <TouchableOpacity
                                onPress={() => markRead(n.id)}
                                activeOpacity={0.8}
                                accessibilityLabel={`${n.read ? '' : 'Nueva: '}${n.title}`}
                            >
                                <GlassCard style={[styles.notifCard, !n.read && styles.unreadCard]}>
                                    <View style={styles.notifRow}>
                                        <View style={[styles.notifIconCircle, { borderColor: typeColors[n.type] }]}>
                                            <Text style={styles.notifIcon}>{n.icon}</Text>
                                        </View>
                                        <View style={styles.notifContent}>
                                            <View style={styles.notifTitleRow}>
                                                <Text style={[styles.notifTitle, !n.read && styles.unreadTitle]}>{n.title}</Text>
                                                {!n.read && <View style={styles.unreadDot} />}
                                            </View>
                                            <Text style={styles.notifMessage}>{n.message}</Text>
                                            <Text style={styles.notifTime}>{timeAgo(n.timestamp)}</Text>
                                        </View>
                                    </View>
                                </GlassCard>
                            </TouchableOpacity>
                        </div>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

// ─── ESTILOS ───────────────────────────────────────────────
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, paddingTop: 48 },

    // Header
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, marginBottom: spacing.md },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    headerEmoji: { fontSize: 32 },
    headerTitle: { fontSize: typography.sizeTitle, fontWeight: typography.weightBold, color: colors.text, fontFamily: typography.fontTitle },
    headerSubtitle: { fontSize: typography.sizeSmall, color: colors.text, opacity: 0.6 },
    readAllBtn: { backgroundColor: 'rgba(124, 154, 146, 0.15)', borderRadius: borders.radiusFull, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
    readAllText: { fontSize: 11, color: colors.primary, fontWeight: typography.weightBold },

    // Filters
    filterRow: { paddingHorizontal: spacing.lg, gap: spacing.sm, paddingBottom: spacing.md },
    filterChip: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
        borderRadius: borders.radiusFull, backgroundColor: colors.glass,
    },
    filterActive: { backgroundColor: 'rgba(124, 154, 146, 0.15)', borderWidth: 1, borderColor: colors.primary },
    filterIcon: { fontSize: 12 },
    filterLabel: { fontSize: 11, color: colors.text, opacity: 0.6 },
    filterLabelActive: { opacity: 1, color: colors.primary, fontWeight: typography.weightBold },

    // List
    list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, gap: spacing.sm },

    // Notification card
    notifCard: { gap: 0, paddingVertical: spacing.md },
    unreadCard: { borderLeftWidth: 3, borderLeftColor: colors.primary },
    notifRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
    notifIconCircle: {
        width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(124, 154, 146, 0.08)', borderWidth: 1,
    },
    notifIcon: { fontSize: 16 },
    notifContent: { flex: 1, gap: 2 },
    notifTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    notifTitle: { fontSize: 13, fontWeight: typography.weightBold, color: colors.text, fontFamily: typography.fontBody },
    unreadTitle: { color: colors.primary },
    unreadDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary },
    notifMessage: { fontSize: 12, color: colors.text, opacity: 0.7, lineHeight: 17 },
    notifTime: { fontSize: 10, color: colors.text, opacity: 0.4 },

    // Empty
    emptyState: { alignItems: 'center', paddingVertical: spacing.huge, gap: spacing.sm },
    emptyText: { fontSize: typography.sizeBody, color: colors.text, opacity: 0.5, fontStyle: 'italic' },
});
