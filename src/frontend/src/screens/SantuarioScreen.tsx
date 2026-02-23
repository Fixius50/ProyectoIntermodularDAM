import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GlassCard } from '../components/GlassCard';

export function SantuarioScreen() {
    return (
        <View style={styles.container}>
            {/* Dynamic Background Simulation */}
            <View style={styles.backgroundLayer}>
                <View style={styles.skyPlaceholder} />
                <View style={styles.treePlaceholder}>
                    <Text style={styles.treeEmoji}>🌳</Text>
                    <Text style={styles.birdEmoji}>🐦</Text>
                </View>
            </View>

            {/* Top Panel - Weather and Resources */}
            <View style={styles.topPanel}>
                <GlassCard style={styles.weatherCard}>
                    <Text style={styles.weatherText}>🌤 Madrid: Despejado | 🌡 18ºC</Text>
                </GlassCard>
                <GlassCard style={styles.resourceCard}>
                    <Text style={styles.resourceText}>🌰 Semillas: 150</Text>
                </GlassCard>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#7C9A92', // Base sage green background
    },
    backgroundLayer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 100,
    },
    skyPlaceholder: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'linear-gradient(180deg, #A8C2BB 0%, #FDFBF7 100%)' as any,
    },
    treePlaceholder: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    treeEmoji: {
        fontSize: 250,
    },
    birdEmoji: {
        position: 'absolute',
        top: 40,
        right: 20,
        fontSize: 40,
    },
    topPanel: {
        paddingTop: 40,
        paddingHorizontal: 20,
        flexDirection: 'column',
        gap: 12,
    },
    weatherCard: {
        alignSelf: 'stretch',
        alignItems: 'center',
    },
    weatherText: {
        fontSize: 16,
        color: '#2C3E50',
        fontWeight: '600',
        fontFamily: 'system-ui',
    },
    resourceCard: {
        alignSelf: 'flex-end',
    },
    resourceText: {
        fontSize: 16,
        color: '#D9A08B', // Terracota para destacar el recurso
        fontWeight: 'bold',
    },
});
