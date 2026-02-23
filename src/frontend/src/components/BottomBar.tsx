import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
// Reemplazaremos Lucide por Emojis temporales o texto hasta que el SVG cargue bien.

interface BottomBarProps {
    currentTab: string;
    onTabChange: (tab: string) => void;
}

export function BottomBar({ currentTab, onTabChange }: BottomBarProps) {
    const tabs = [
        { id: 'santuario', label: 'Santuario', icon: '🏡' },
        { id: 'expedicion', label: 'Expedición', icon: '🗺️' },
        { id: 'taller', label: 'Taller', icon: '🔨' },
        { id: 'certamen', label: 'Certamen', icon: '⚔️' },
    ];

    return (
        <View style={styles.container}>
            {tabs.map((tab) => {
                const isActive = currentTab === tab.id;
                return (
                    <TouchableOpacity
                        key={tab.id}
                        style={styles.tab}
                        onPress={() => onTabChange(tab.id)}
                        accessibilityRole="button"
                        accessibilityLabel={`Ir a ${tab.label}`}
                    >
                        <Text style={[styles.icon, isActive && styles.iconActive]}>{tab.icon}</Text>
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
        backgroundColor: '#FDFBF7',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#2C3E50',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 8,
        borderWidth: 1,
        borderColor: 'rgba(124, 154, 146, 0.2)',
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    icon: {
        fontSize: 24,
        opacity: 0.5,
    },
    iconActive: {
        opacity: 1,
    },
    label: {
        fontSize: 12,
        color: '#2C3E50',
        opacity: 0.6,
        fontFamily: 'system-ui',
    },
    labelActive: {
        color: '#7C9A92',
        fontWeight: 'bold',
        opacity: 1,
    },
});
