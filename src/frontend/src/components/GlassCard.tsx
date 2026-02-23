import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface GlassCardProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

export function GlassCard({ children, style }: GlassCardProps) {
    return (
        <View style={[styles.card, style]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'rgba(253, 251, 247, 0.7)', // Crema semitransparente
        borderRadius: 20,
        padding: 16,
        // Sombra sutil para darle profundidad
        shadowColor: '#2C3E50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        // En Web, podemos usar backdrop-filter para el desenfoque
        //@ts-ignore - Propiedad web específica
        backdropFilter: 'blur(10px)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
});
