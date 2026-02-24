import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { colors, typography, spacing, borders, shadows } from '../theme/theme';

interface ResourceCounterProps {
    icon: string;
    value: number;
    label?: string;
}

/**
 * Pastilla visual con icono + número animado.
 * Se usa para mostrar semillas, notas de campo, materiales, etc.
 */
export function ResourceCounter({ icon, value, label }: ResourceCounterProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.icon}>{icon}</Text>
            <Text style={styles.value}>{value}</Text>
            {label && <Text style={styles.label}>{label}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.glass,
        borderRadius: borders.radiusFull,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        gap: spacing.xs,
        borderWidth: 1,
        borderColor: colors.glassBorder,
        ...shadows.card,
        //@ts-ignore
        backdropFilter: 'blur(10px)',
    },
    icon: {
        fontSize: typography.sizeBody,
    },
    value: {
        fontSize: typography.sizeBody,
        fontWeight: typography.weightBold,
        color: colors.secondary,
        fontFamily: typography.fontBody,
    },
    label: {
        fontSize: typography.sizeCaption,
        color: colors.text,
        fontFamily: typography.fontBody,
        opacity: 0.7,
    },
});
