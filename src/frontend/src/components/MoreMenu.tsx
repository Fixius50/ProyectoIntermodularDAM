/**
 * AVIS — Menú "Más" (pantallas secundarias)
 * Se abre desde el 5º tab de la BottomBar.
 * Muestra accesos a: Álbum, Bandada, Mercado, Coop, Perfil, Avisos.
 */
import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, borders, shadows } from '../theme/theme';

// CSS Animations
const moreMenuCSS = `
@keyframes menuSlideUp {
  0%   { opacity: 0; transform: translateY(16px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes menuItemEnter {
  0%   { opacity: 0; transform: translateX(-8px); }
  100% { opacity: 1; transform: translateX(0); }
}
@keyframes overlayFadeIn {
  0%   { opacity: 0; }
  100% { opacity: 1; }
}
`;

interface MoreMenuItem {
    id: string;
    label: string;
    icon: string;
    desc: string;
    badge?: number;
}

const MENU_ITEMS: MoreMenuItem[] = [
    { id: 'album', label: 'Álbum', icon: '📖', desc: 'Tu colección de aves' },
    { id: 'bandada', label: 'Bandada', icon: '🦅', desc: 'Chat y comunidad' },
    { id: 'mercado', label: 'Mercado', icon: '🏪', desc: 'Compra y vende cartas' },
    { id: 'coop', label: 'Cooperación', icon: '🤝', desc: 'Juego cooperativo' },
    { id: 'perfil', label: 'Perfil', icon: '👤', desc: 'Tu naturalista' },
    { id: 'avisos', label: 'Avisos', icon: '🔔', desc: 'Notificaciones', badge: 3 },
];

interface MoreMenuProps {
    onSelect: (id: string) => void;
    onClose: () => void;
}

export function MoreMenu({ onSelect, onClose }: MoreMenuProps) {
    return (
        <>
            <style>{moreMenuCSS}</style>

            {/* Overlay */}
            <div
                style={{
                    position: 'fixed', inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    zIndex: 999,
                    animation: 'overlayFadeIn 0.2s ease',
                }}
                onClick={onClose}
            />

            {/* Menu panel */}
            <div style={{
                position: 'fixed',
                bottom: 70, left: 12, right: 12,
                zIndex: 1000,
                animation: 'menuSlideUp 0.3s ease-out',
            }}>
                <View style={styles.menuPanel}>
                    <View style={styles.menuHeader}>
                        <Text style={styles.menuTitle}>Más opciones</Text>
                        <TouchableOpacity onPress={onClose} accessibilityLabel="Cerrar menú">
                            <Text style={styles.closeBtn}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.menuGrid}>
                        {MENU_ITEMS.map((item, idx) => (
                            <div key={item.id} style={{ animation: `menuItemEnter 0.25s ease-out ${idx * 0.05}s both` }}>
                                <TouchableOpacity
                                    style={styles.menuItem}
                                    onPress={() => onSelect(item.id)}
                                    accessibilityLabel={`Ir a ${item.label}`}
                                >
                                    <View style={styles.menuIconCircle}>
                                        <Text style={styles.menuIcon}>{item.icon}</Text>
                                        {item.badge && item.badge > 0 && (
                                            <View style={styles.badge}>
                                                <Text style={styles.badgeText}>{item.badge}</Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text style={styles.menuLabel}>{item.label}</Text>
                                    <Text style={styles.menuDesc}>{item.desc}</Text>
                                </TouchableOpacity>
                            </div>
                        ))}
                    </View>
                </View>
            </div>
        </>
    );
}

const styles = StyleSheet.create({
    menuPanel: {
        backgroundColor: colors.background,
        borderRadius: borders.radiusLarge,
        padding: spacing.lg,
        ...shadows.glass,
        borderWidth: 1,
        borderColor: colors.glassBorder,
    },
    menuHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    menuTitle: {
        fontSize: typography.sizeSubtitle,
        fontWeight: typography.weightBold,
        color: colors.text,
        fontFamily: typography.fontTitle,
    },
    closeBtn: {
        fontSize: 18,
        color: colors.text,
        opacity: 0.4,
        padding: spacing.sm,
    },
    menuGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    menuItem: {
        width: '30%' as any,
        alignItems: 'center',
        gap: 4,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.sm,
        borderRadius: borders.radiusMedium,
        backgroundColor: 'rgba(124, 154, 146, 0.05)',
    },
    menuIconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(124, 154, 146, 0.1)',
        position: 'relative' as any,
    },
    menuIcon: { fontSize: 22 },
    badge: {
        position: 'absolute' as any,
        top: -2,
        right: -2,
        backgroundColor: colors.error,
        borderRadius: 8,
        minWidth: 16,
        height: 16,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    badgeText: {
        fontSize: 9,
        color: '#FFF',
        fontWeight: typography.weightBold,
    },
    menuLabel: {
        fontSize: 12,
        fontWeight: typography.weightBold,
        color: colors.text,
        textAlign: 'center' as any,
    },
    menuDesc: {
        fontSize: 9,
        color: colors.text,
        opacity: 0.5,
        textAlign: 'center' as any,
    },
});
