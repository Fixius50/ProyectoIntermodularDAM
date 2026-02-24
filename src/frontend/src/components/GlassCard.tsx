import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, borders, shadows } from '../theme/theme';

interface GlassCardProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

/**
 * Tarjeta con efecto glassmorphism (Cuaderno de Campo Vivo).
 * Panel semitransparente con desenfoque para superponer sobre fondos de naturaleza.
 */
export function GlassCard({ children, style }: GlassCardProps) {
    return (
        <View style={[styles.card, style]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.glass,
        borderRadius: borders.radiusLarge,
        padding: spacing.lg,
        ...shadows.glass,
        //@ts-ignore - Propiedad web específica
        backdropFilter: 'blur(10px)',
        borderWidth: 1,
        borderColor: colors.glassBorder,
    },
});
