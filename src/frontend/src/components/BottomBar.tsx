import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { colors, typography, spacing, borders, shadows } from '../theme/theme';

interface BottomBarProps {
    currentTab: string;
    onTabChange: (tab: string) => void;
    isMoreOpen?: boolean;
}

/**
 * Barra inferior de navegación persistente — 5 iconos.
 * Los 4 primeros son pantallas principales del juego.
 * El 5to abre el menú "Más" con las pantallas secundarias.
 */
export function BottomBar({ currentTab, onTabChange, isMoreOpen }: BottomBarProps) {
    const tabs = [
        { id: 'santuario', label: 'Santuario', icon: '🏡' },
        { id: 'expedicion', label: 'Expedición', icon: '🗺️' },
        { id: 'taller', label: 'Taller', icon: '🔨' },
        { id: 'certamen', label: 'Certamen', icon: '⚔️' },
        { id: '_more', label: 'Más', icon: '☰' },
    ];

    // Secondary screen IDs that should highlight the "Más" tab
    const secondaryScreens = ['album', 'bandada', 'mercado', 'coop', 'perfil', 'avisos'];

    return (
        <View style={styles.container}>
            {tabs.map((tab) => {
                let isActive: boolean;
                if (tab.id === '_more') {
                    isActive = isMoreOpen || secondaryScreens.includes(currentTab);
                } else {
                    isActive = currentTab === tab.id;
                }
                return (
                    <TouchableOpacity
                        key={tab.id}
                        style={[styles.tab, isActive && styles.tabActive]}
                        onPress={() => onTabChange(tab.id)}
                        accessibilityRole="button"
                        accessibilityLabel={`Ir a ${tab.label}`}
                    >
                        <Text style={[styles.icon, isActive && styles.iconActive]}>
                            {tab.id === '_more' && isMoreOpen ? '✕' : tab.icon}
                        </Text>
                        <Text style={[styles.label, isActive && styles.labelActive]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.background,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.sm,
        borderTopLeftRadius: borders.radiusLarge,
        borderTopRightRadius: borders.radiusLarge,
        ...shadows.bottomBar,
        borderWidth: 1,
        borderColor: `rgba(124, 154, 146, 0.2)`,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
        paddingVertical: 2,
        borderRadius: borders.radiusMedium,
    },
    tabActive: {
        backgroundColor: 'rgba(124, 154, 146, 0.08)',
    },
    icon: {
        fontSize: 22,
        opacity: 0.5,
    },
    iconActive: {
        opacity: 1,
    },
    label: {
        fontSize: typography.sizeSmall,
        color: colors.text,
        opacity: 0.6,
        fontFamily: typography.fontBody,
    },
    labelActive: {
        color: colors.primary,
        fontWeight: typography.weightBold,
        opacity: 1,
    },
});
