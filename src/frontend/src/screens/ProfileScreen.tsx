/**
 * AVIS — Pantalla de Perfil del Naturalista
 * Muestra estadísticas del jugador, logros, colección y ajustes.
 */
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { GlassCard } from '../components/GlassCard';
import { useAuth } from '../context/AuthContext';
import { colors, typography, spacing, borders, shadows } from '../theme/theme';

// CSS Animations
const profileAnimCSS = `
@keyframes fadeSlideUp {
  0%   { opacity: 0; transform: translateY(12px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes avatarPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(124, 154, 146, 0.3); }
  50%      { box-shadow: 0 0 0 8px rgba(124, 154, 146, 0); }
}
@keyframes levelGlow {
  0%, 100% { text-shadow: 0 0 4px rgba(218, 165, 32, 0.2); }
  50%      { text-shadow: 0 0 12px rgba(218, 165, 32, 0.5); }
}
`;

// ─── DATOS MOCK DEL PERFIL ─────────────────────────────────
const mockStats = {
    level: 14,
    xp: 1450,
    xpToNext: 2000,
    birdsDiscovered: 28,
    totalBirds: 45,
    expeditionsCompleted: 37,
    certamenWins: 12,
    certamenLosses: 5,
    cardsCollected: 42,
    materialsCrafted: 18,
    flockName: 'Aves del Mediterráneo',
    daysPlaying: 23,
    seeds: 1240,
    fieldNotes: 85,
};

const mockAchievements = [
    { id: 'a1', icon: '🏆', title: 'Primera Victoria', desc: 'Gana tu primer certamen', unlocked: true },
    { id: 'a2', icon: '🦅', title: 'Observador Experto', desc: 'Descubre 25 especies', unlocked: true },
    { id: 'a3', icon: '🎨', title: 'Artista Natural', desc: 'Fabrica 15 cartas', unlocked: true },
    { id: 'a4', icon: '🗺️', title: 'Explorador Incansable', desc: 'Completa 30 expediciones', unlocked: true },
    { id: 'a5', icon: '🤝', title: 'Líder de Bandada', desc: 'Alcanza 10 miembros en tu bandada', unlocked: false },
    { id: 'a6', icon: '💎', title: 'Coleccionista Legendario', desc: 'Consigue todas las cartas legendarias', unlocked: false },
    { id: 'a7', icon: '📈', title: 'Magnate del Mercado', desc: 'Completa 50 transacciones', unlocked: false },
    { id: 'a8', icon: '🧪', title: 'Investigador', desc: 'Completa 10 entrenamientos cooperativos', unlocked: false },
];

// ─── COMPONENTE DE STAT ────────────────────────────────────
function StatItem({ icon, label, value, delay }: { icon: string; label: string; value: string | number; delay: number }) {
    return (
        <div style={{ animation: `fadeSlideUp 0.4s ease-out ${delay}s both` }}>
            <View style={styles.statItem}>
                <Text style={styles.statIcon}>{icon}</Text>
                <View>
                    <Text style={styles.statValue}>{value}</Text>
                    <Text style={styles.statLabel}>{label}</Text>
                </View>
            </View>
        </div>
    );
}

// ─── SCREEN ────────────────────────────────────────────────
export function ProfileScreen() {
    const { logout } = useAuth();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleLogout = useCallback(() => {
        setShowLogoutConfirm(false);
        logout();
    }, [logout]);

    const unlockedCount = mockAchievements.filter((a) => a.unlocked).length;
    const xpPercent = Math.round((mockStats.xp / mockStats.xpToNext) * 100);
    const collectionPercent = Math.round((mockStats.birdsDiscovered / mockStats.totalBirds) * 100);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <style>{profileAnimCSS}</style>

            {/* Avatar + Name */}
            <div style={{ animation: 'fadeSlideUp 0.3s ease-out both' }}>
                <View style={styles.avatarSection}>
                    <div style={{ animation: 'avatarPulse 3s ease-in-out infinite' }}>
                        <View style={styles.avatarCircle}>
                            <Text style={styles.avatarEmoji}>🧑‍🔬</Text>
                        </View>
                    </div>
                    <div style={{ animation: 'levelGlow 3s ease-in-out infinite' }}>
                        <Text style={styles.levelBadge}>Nivel {mockStats.level}</Text>
                    </div>
                    <Text style={styles.playerName}>Naturalista</Text>
                    <Text style={styles.flockLabel}>🦅 {mockStats.flockName}</Text>
                </View>
            </div>

            {/* XP Bar */}
            <div style={{ animation: 'fadeSlideUp 0.4s ease-out 0.1s both' }}>
                <GlassCard style={styles.xpCard}>
                    <View style={styles.xpHeader}>
                        <Text style={styles.xpLabel}>Experiencia</Text>
                        <Text style={styles.xpValue}>{mockStats.xp.toLocaleString()} / {mockStats.xpToNext.toLocaleString()}</Text>
                    </View>
                    <View style={styles.xpBarContainer}>
                        <div style={{
                            height: 12, borderRadius: 6,
                            width: `${xpPercent}%`,
                            background: 'linear-gradient(90deg, #7C9A92, #DAA520)',
                            transition: 'width 1s ease',
                        }} />
                    </View>
                    <Text style={styles.xpPercent}>{xpPercent}% al nivel {mockStats.level + 1}</Text>
                </GlassCard>
            </div>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
                <StatItem icon="🐦" label="Aves descubiertas" value={`${mockStats.birdsDiscovered}/${mockStats.totalBirds}`} delay={0.15} />
                <StatItem icon="🗺️" label="Expediciones" value={mockStats.expeditionsCompleted} delay={0.2} />
                <StatItem icon="⚔️" label="Victorias" value={`${mockStats.certamenWins}W/${mockStats.certamenLosses}L`} delay={0.25} />
                <StatItem icon="🃏" label="Cartas" value={mockStats.cardsCollected} delay={0.3} />
                <StatItem icon="🎨" label="Fabricadas" value={mockStats.materialsCrafted} delay={0.35} />
                <StatItem icon="📅" label="Días jugando" value={mockStats.daysPlaying} delay={0.4} />
            </View>

            {/* Resources */}
            <div style={{ animation: 'fadeSlideUp 0.4s ease-out 0.45s both' }}>
                <GlassCard style={styles.resourceCard}>
                    <Text style={styles.sectionTitle}>💰 Recursos</Text>
                    <View style={styles.resourceRow}>
                        <View style={styles.resourceItem}>
                            <Text style={styles.resourceIcon}>🌱</Text>
                            <Text style={styles.resourceValue}>{mockStats.seeds.toLocaleString()}</Text>
                            <Text style={styles.resourceLabel}>Semillas</Text>
                        </View>
                        <View style={styles.resourceSeparator} />
                        <View style={styles.resourceItem}>
                            <Text style={styles.resourceIcon}>📝</Text>
                            <Text style={styles.resourceValue}>{mockStats.fieldNotes}</Text>
                            <Text style={styles.resourceLabel}>Notas de campo</Text>
                        </View>
                    </View>
                </GlassCard>
            </div>

            {/* Colección */}
            <div style={{ animation: 'fadeSlideUp 0.4s ease-out 0.5s both' }}>
                <GlassCard style={styles.collectionCard}>
                    <View style={styles.xpHeader}>
                        <Text style={styles.sectionTitle}>📖 Colección</Text>
                        <Text style={styles.collectionPercent}>{collectionPercent}%</Text>
                    </View>
                    <View style={styles.xpBarContainer}>
                        <div style={{
                            height: 8, borderRadius: 4,
                            width: `${collectionPercent}%`,
                            background: 'linear-gradient(90deg, #A8C5B8, #7C9A92)',
                            transition: 'width 1s ease',
                        }} />
                    </View>
                </GlassCard>
            </div>

            {/* Logros */}
            <div style={{ animation: 'fadeSlideUp 0.4s ease-out 0.55s both' }}>
                <View style={styles.achievementsSection}>
                    <Text style={styles.sectionTitle}>🏅 Logros ({unlockedCount}/{mockAchievements.length})</Text>
                    <View style={styles.achievementsGrid}>
                        {mockAchievements.map((a) => (
                            <View key={a.id} style={[styles.achvCard, !a.unlocked && styles.achvLocked]}>
                                <Text style={[styles.achvIcon, !a.unlocked && styles.achvIconLocked]}>{a.icon}</Text>
                                <Text style={[styles.achvTitle, !a.unlocked && styles.achvTitleLocked]}>{a.title}</Text>
                                <Text style={styles.achvDesc}>{a.desc}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </div>

            {/* Logout */}
            <div style={{ animation: 'fadeSlideUp 0.4s ease-out 0.6s both' }}>
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => setShowLogoutConfirm(true)}
                    accessibilityLabel="Cerrar sesión"
                >
                    <Text style={styles.logoutText}>🚪 Cerrar sesión</Text>
                </TouchableOpacity>
            </div>

            {/* Logout confirm */}
            {showLogoutConfirm && (
                <div style={{
                    position: 'fixed', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    zIndex: 1000,
                    animation: 'fadeSlideUp 0.3s ease',
                }}>
                    <View style={styles.confirmModal}>
                        <Text style={styles.confirmTitle}>¿Cerrar sesión?</Text>
                        <Text style={styles.confirmDesc}>Se cerrará tu sesión actual.</Text>
                        <View style={styles.confirmActions}>
                            <TouchableOpacity
                                style={styles.cancelBtn}
                                onPress={() => setShowLogoutConfirm(false)}
                            >
                                <Text style={styles.cancelText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.confirmBtn} onPress={handleLogout}>
                                <Text style={styles.confirmBtnText}>Cerrar sesión</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </div>
            )}
        </ScrollView>
    );
}

// ─── ESTILOS ───────────────────────────────────────────────
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { paddingTop: 48, paddingHorizontal: spacing.lg, paddingBottom: spacing.huge, gap: spacing.md },

    // Avatar
    avatarSection: { alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
    avatarCircle: {
        width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center',
        backgroundColor: colors.glass, borderWidth: 2, borderColor: colors.primary,
    },
    avatarEmoji: { fontSize: 40 },
    levelBadge: { fontSize: 14, fontWeight: typography.weightBold, color: '#DAA520', fontFamily: typography.fontTitle },
    playerName: { fontSize: typography.sizeTitle, fontWeight: typography.weightBold, color: colors.text, fontFamily: typography.fontTitle },
    flockLabel: { fontSize: typography.sizeSmall, color: colors.text, opacity: 0.6 },

    // XP
    xpCard: { gap: spacing.sm },
    xpHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    xpLabel: { fontSize: typography.sizeSmall, color: colors.text, opacity: 0.6 },
    xpValue: { fontSize: typography.sizeSmall, fontWeight: typography.weightBold, color: colors.primary },
    xpBarContainer: { height: 12, backgroundColor: 'rgba(124, 154, 146, 0.15)', borderRadius: 6, overflow: 'hidden' },
    xpPercent: { fontSize: 11, color: colors.text, opacity: 0.5, textAlign: 'center' as any },

    // Stats Grid
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
    statItem: {
        flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
        backgroundColor: colors.glass, borderRadius: borders.radiusMedium,
        paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
        width: '48%' as any, borderWidth: 1, borderColor: colors.glassBorder,
    },
    statIcon: { fontSize: 20 },
    statValue: { fontSize: typography.sizeBody, fontWeight: typography.weightBold, color: colors.text, fontFamily: typography.fontBody },
    statLabel: { fontSize: 10, color: colors.text, opacity: 0.5 },

    // Resources
    resourceCard: { gap: spacing.md },
    sectionTitle: { fontSize: typography.sizeBody, fontWeight: typography.weightBold, color: colors.text, fontFamily: typography.fontTitle },
    resourceRow: { flexDirection: 'row', alignItems: 'center' },
    resourceItem: { flex: 1, alignItems: 'center', gap: 2 },
    resourceIcon: { fontSize: 24 },
    resourceValue: { fontSize: typography.sizeTitle, fontWeight: typography.weightBold, color: colors.text },
    resourceLabel: { fontSize: 11, color: colors.text, opacity: 0.5 },
    resourceSeparator: { width: 1, height: 40, backgroundColor: colors.glassBorder },

    // Collection
    collectionCard: { gap: spacing.sm },
    collectionPercent: { fontSize: typography.sizeBody, fontWeight: typography.weightBold, color: colors.primary },

    // Achievements
    achievementsSection: { gap: spacing.md },
    achievementsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
    achvCard: {
        width: '48%' as any, backgroundColor: colors.glass, borderRadius: borders.radiusMedium,
        padding: spacing.md, alignItems: 'center', gap: 4,
        borderWidth: 1, borderColor: colors.glassBorder,
    },
    achvLocked: { opacity: 0.35 },
    achvIcon: { fontSize: 28 },
    achvIconLocked: { filter: 'grayscale(1)' } as any,
    achvTitle: { fontSize: 12, fontWeight: typography.weightBold, color: colors.text, textAlign: 'center' as any },
    achvTitleLocked: { color: colors.text },
    achvDesc: { fontSize: 10, color: colors.text, opacity: 0.5, textAlign: 'center' as any },

    // Logout
    logoutButton: {
        backgroundColor: 'rgba(200, 80, 80, 0.1)', borderRadius: borders.radiusFull,
        paddingVertical: spacing.md, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(200, 80, 80, 0.2)',
        marginTop: spacing.md,
    },
    logoutText: { fontSize: typography.sizeBody, color: colors.danger, fontWeight: typography.weightBold },

    // Confirm modal
    confirmModal: {
        backgroundColor: colors.background, borderRadius: borders.radiusLarge,
        padding: spacing.xl, alignItems: 'center', gap: spacing.md,
        ...shadows.glass, minWidth: 280,
    },
    confirmTitle: { fontSize: typography.sizeTitle, fontWeight: typography.weightBold, color: colors.text, fontFamily: typography.fontTitle },
    confirmDesc: { fontSize: typography.sizeBody, color: colors.text, opacity: 0.6 },
    confirmActions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
    cancelBtn: { flex: 1, backgroundColor: colors.glass, borderRadius: borders.radiusFull, paddingVertical: spacing.sm, alignItems: 'center' },
    cancelText: { fontSize: typography.sizeSmall, color: colors.text },
    confirmBtn: { flex: 1, backgroundColor: colors.danger, borderRadius: borders.radiusFull, paddingVertical: spacing.sm, alignItems: 'center' },
    confirmBtnText: { fontSize: typography.sizeSmall, color: '#FFF', fontWeight: typography.weightBold },
});
