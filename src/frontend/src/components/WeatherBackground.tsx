import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WeatherCondition } from '../types/types';
import { colors } from '../theme/theme';

interface WeatherBackgroundProps {
    condition: WeatherCondition;
    children: React.ReactNode;
}

/**
 * Fondo dinámico que cambia según el estado del clima.
 * Incluye animaciones CSS para lluvia, viento, noche y sol.
 */
export function WeatherBackground({ condition, children }: WeatherBackgroundProps) {
    const bgColors = getBackgroundColors(condition);

    return (
        <View style={styles.container}>
            {/* Gradiente animado */}
            <View style={[styles.gradientTop, { backgroundColor: bgColors.top }]} />
            <View style={[styles.gradientBottom, { backgroundColor: bgColors.bottom }]} />

            {/* Efectos de clima animados */}
            {condition === 'SOL' && <SunEffect />}
            {condition === 'LLUVIA' && <RainEffect />}
            {condition === 'NOCHE' && <NightEffect />}
            {condition === 'VIENTO' && <WindEffect />}
            {condition === 'NUBLADO' && <CloudEffect />}

            {/* Inyectar CSS animations (web) */}
            <style>{weatherAnimationsCSS}</style>

            {/* Contenido */}
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
}

function getBackgroundColors(condition: WeatherCondition) {
    switch (condition) {
        case 'SOL':
            return { top: '#87CEEB', bottom: '#C8E6C9' };
        case 'LLUVIA':
            return { top: '#546E7A', bottom: '#78909C' };
        case 'NOCHE':
            return { top: '#0D1B2A', bottom: '#1B2838' };
        case 'VIENTO':
            return { top: '#90A4AE', bottom: '#B0BEC5' };
        case 'NUBLADO':
            return { top: '#90A4AE', bottom: '#B0BEC5' };
        default:
            return { top: '#87CEEB', bottom: colors.primaryLight };
    }
}

/* ─── Sol: rayos suaves ───────────────────────────────────── */
function SunEffect() {
    return (
        <View style={styles.effectOverlay}>
            <div style={{
                position: 'absolute', top: '8%', right: '10%',
                width: 80, height: 80, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,235,59,0.5) 0%, rgba(255,235,59,0) 70%)',
                animation: 'sunPulse 3s ease-in-out infinite',
            }} />
            {/* Rayos de luz */}
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{
                    position: 'absolute', top: '5%', right: '12%',
                    width: 2, height: 50 + i * 8,
                    background: `rgba(255, 235, 59, ${0.08 + i * 0.02})`,
                    transform: `rotate(${i * 60}deg)`,
                    transformOrigin: 'bottom center',
                    borderRadius: 1,
                    animation: `sunRay 4s ease-in-out ${i * 0.3}s infinite`,
                }} />
            ))}
        </View>
    );
}

/* ─── Lluvia: gotas que caen ──────────────────────────────── */
function RainEffect() {
    return (
        <View style={styles.effectOverlay}>
            {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} style={{
                    position: 'absolute',
                    left: `${Math.random() * 100}%`,
                    top: `${-5 - Math.random() * 10}%`,
                    width: 2,
                    height: 14 + Math.random() * 10,
                    background: 'rgba(173, 216, 230, 0.5)',
                    borderRadius: 1,
                    animation: `rainFall ${0.6 + Math.random() * 0.6}s linear ${Math.random() * 1.5}s infinite`,
                }} />
            ))}
        </View>
    );
}

/* ─── Noche: estrellas titilantes ─────────────────────────── */
function NightEffect() {
    return (
        <>
            <View style={styles.nightOverlay} />
            <View style={styles.effectOverlay}>
                {Array.from({ length: 25 }).map((_, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        left: `${Math.random() * 95}%`,
                        top: `${Math.random() * 60}%`,
                        width: 3 + Math.random() * 2,
                        height: 3 + Math.random() * 2,
                        borderRadius: '50%',
                        background: `rgba(255, 255, 255, ${0.3 + Math.random() * 0.5})`,
                        animation: `starTwinkle ${1.5 + Math.random() * 3}s ease-in-out ${Math.random() * 2}s infinite`,
                    }} />
                ))}
                {/* Luna */}
                <div style={{
                    position: 'absolute', top: '10%', right: '15%',
                    width: 50, height: 50, borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 35%, #FFFDE7 0%, #FFF9C4 60%, rgba(255,249,196,0) 100%)',
                    boxShadow: '0 0 30px rgba(255, 253, 231, 0.3)',
                    animation: 'moonGlow 5s ease-in-out infinite',
                }} />
            </View>
        </>
    );
}

/* ─── Viento: líneas horizontales que se mueven ───────────── */
function WindEffect() {
    return (
        <View style={styles.effectOverlay}>
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{
                    position: 'absolute',
                    top: `${10 + i * 11}%`,
                    left: '-30%',
                    width: `${20 + Math.random() * 20}%`,
                    height: 1,
                    background: 'rgba(255, 255, 255, 0.25)',
                    borderRadius: 1,
                    animation: `windBlow ${2 + Math.random() * 2}s ease-in-out ${i * 0.3}s infinite`,
                }} />
            ))}
        </View>
    );
}

/* ─── Nublado: nubes flotantes ────────────────────────────── */
function CloudEffect() {
    return (
        <View style={styles.effectOverlay}>
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{
                    position: 'absolute',
                    top: `${8 + i * 12}%`,
                    left: `${-20 + i * 15}%`,
                    width: 100 + i * 30,
                    height: 30 + i * 5,
                    borderRadius: 20,
                    background: `rgba(255, 255, 255, ${0.15 + i * 0.05})`,
                    filter: 'blur(8px)',
                    animation: `cloudDrift ${12 + i * 4}s ease-in-out ${i * 2}s infinite alternate`,
                }} />
            ))}
        </View>
    );
}

/* ─── CSS Keyframes (inyectado en web) ────────────────────── */
const weatherAnimationsCSS = `
@keyframes rainFall {
  0%   { transform: translateY(0);    opacity: 0; }
  10%  { opacity: 0.6; }
  90%  { opacity: 0.4; }
  100% { transform: translateY(110vh); opacity: 0; }
}

@keyframes starTwinkle {
  0%, 100% { opacity: 0.2; transform: scale(0.8); }
  50%      { opacity: 1;   transform: scale(1.2); }
}

@keyframes moonGlow {
  0%, 100% { box-shadow: 0 0 30px rgba(255, 253, 231, 0.2); }
  50%      { box-shadow: 0 0 50px rgba(255, 253, 231, 0.5); }
}

@keyframes windBlow {
  0%   { transform: translateX(0);     opacity: 0; }
  20%  { opacity: 0.3; }
  80%  { opacity: 0.2; }
  100% { transform: translateX(160vw); opacity: 0; }
}

@keyframes cloudDrift {
  0%   { transform: translateX(0); }
  100% { transform: translateX(30vw); }
}

@keyframes sunPulse {
  0%, 100% { transform: scale(1);   opacity: 0.6; }
  50%      { transform: scale(1.3); opacity: 0.9; }
}

@keyframes sunRay {
  0%, 100% { opacity: 0.05; height: 40px; }
  50%      { opacity: 0.15; height: 60px; }
}

@keyframes heartFloat {
  0%   { transform: translateY(0) scale(1);   opacity: 1; }
  60%  { transform: translateY(-20px) scale(1.2); opacity: 0.8; }
  100% { transform: translateY(-35px) scale(0.8); opacity: 0; }
}

@keyframes birdBounce {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-3px); }
}

@keyframes goldenGlow {
  0%, 100% { box-shadow: 0 0 8px rgba(255, 193, 7, 0.2); }
  50%      { box-shadow: 0 0 20px rgba(255, 193, 7, 0.5); }
}
`;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    gradientTop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '55%' as any,
        //@ts-ignore
        transition: 'background-color 1s ease',
    },
    gradientBottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%' as any,
        //@ts-ignore
        transition: 'background-color 1s ease',
    },
    content: {
        flex: 1,
        zIndex: 10,
    },
    effectOverlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 5,
        pointerEvents: 'none',
        overflow: 'hidden',
    },
    nightOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        zIndex: 4,
        pointerEvents: 'none',
    },
});
