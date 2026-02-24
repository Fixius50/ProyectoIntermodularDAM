/**
 * AVIS — Pantalla de Login
 * Diseño glassmorphism con el Design System "Living Field Notebook".
 */
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors, typography, spacing, borders, shadows } from '../theme/theme';

// CSS animations
const loginAnimCSS = `
@keyframes fadeSlideUp {
  0%   { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes logoPulse {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.05); }
}
@keyframes inputGlow {
  0%, 100% { box-shadow: 0 0 0 rgba(124, 154, 146, 0); }
  50%      { box-shadow: 0 0 12px rgba(124, 154, 146, 0.3); }
}
@keyframes shakeError {
  0%, 100% { transform: translateX(0); }
  20%      { transform: translateX(-8px); }
  40%      { transform: translateX(8px); }
  60%      { transform: translateX(-5px); }
  80%      { transform: translateX(5px); }
}
`;

interface LoginScreenProps {
    onNavigateToRegister: () => void;
}

export function LoginScreen({ onNavigateToRegister }: LoginScreenProps) {
    const { login, isLoading, state, clearError } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [hasError, setHasError] = useState(false);

    const handleLogin = useCallback(async () => {
        if (!email.trim() || !password.trim()) return;

        setHasError(false);
        try {
            await login(email.trim(), password);
        } catch {
            setHasError(true);
            setTimeout(() => setHasError(false), 600);
        }
    }, [email, password, login]);

    const handleEmailChange = useCallback((text: string) => {
        setEmail(text);
        if (state.error) clearError();
    }, [state.error, clearError]);

    const handlePasswordChange = useCallback((text: string) => {
        setPassword(text);
        if (state.error) clearError();
    }, [state.error, clearError]);

    const isFormValid = email.trim().length > 0 && password.trim().length > 0;

    return (
        <View style={styles.container}>
            <style>{loginAnimCSS}</style>

            {/* Background decorativo */}
            <div style={{
                position: 'absolute', inset: 0,
                background: `
                    radial-gradient(ellipse at 20% 20%, rgba(124, 154, 146, 0.15) 0%, transparent 60%),
                    radial-gradient(ellipse at 80% 80%, rgba(168, 197, 184, 0.1) 0%, transparent 50%),
                    linear-gradient(180deg, ${colors.background}, #E8E0D4)
                `,
                zIndex: 0,
            }} />

            <div style={{
                position: 'relative', zIndex: 1,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                width: '100%', maxWidth: 400, padding: '0 24px',
                animation: 'fadeSlideUp 0.6s ease-out',
            }}>
                {/* Logo */}
                <div style={{ animation: 'logoPulse 3s ease-in-out infinite', marginBottom: 8 }}>
                    <Text style={styles.logoEmoji}>🐦</Text>
                </div>
                <Text style={styles.title}>AVIS</Text>
                <Text style={styles.subtitle}>Tu cuaderno de naturalista</Text>

                {/* Card de formulario */}
                <View style={styles.formCard}>
                    {/* Email */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>📧 Correo electrónico</Text>
                        <TextInput
                            style={[styles.input, hasError && styles.inputError]}
                            value={email}
                            onChangeText={handleEmailChange}
                            placeholder="demo@avis.com"
                            placeholderTextColor="rgba(74, 56, 42, 0.3)"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                            accessibilityLabel="Correo electrónico"
                            editable={!isLoading}
                        />
                    </View>

                    {/* Password */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>🔒 Contraseña</Text>
                        <View style={styles.passwordRow}>
                            <TextInput
                                style={[styles.input, styles.passwordInput, hasError && styles.inputError]}
                                value={password}
                                onChangeText={handlePasswordChange}
                                placeholder="••••••"
                                placeholderTextColor="rgba(74, 56, 42, 0.3)"
                                secureTextEntry={!showPassword}
                                autoComplete="password"
                                accessibilityLabel="Contraseña"
                                editable={!isLoading}
                            />
                            <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => setShowPassword(!showPassword)}
                                accessibilityLabel={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            >
                                <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Error message */}
                    {state.error && (
                        <div style={{ animation: 'shakeError 0.5s ease' }}>
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>⚠️ {state.error}</Text>
                            </View>
                        </div>
                    )}

                    {/* Botón Login */}
                    <TouchableOpacity
                        style={[styles.loginButton, (!isFormValid || isLoading) && styles.loginButtonDisabled]}
                        onPress={handleLogin}
                        disabled={!isFormValid || isLoading}
                        accessibilityLabel="Iniciar sesión"
                        accessibilityRole="button"
                    >
                        {isLoading ? (
                            <ActivityIndicator color={colors.white} size="small" />
                        ) : (
                            <Text style={styles.loginButtonText}>Entrar al campo 🌿</Text>
                        )}
                    </TouchableOpacity>

                    {/* Demo hint */}
                    <View style={styles.demoHint}>
                        <Text style={styles.demoText}>
                            🧪 Demo: demo@avis.com / demo123
                        </Text>
                    </View>
                </View>

                {/* Enlace a Registro */}
                <TouchableOpacity
                    style={styles.switchLink}
                    onPress={onNavigateToRegister}
                    accessibilityLabel="Ir a crear cuenta"
                    accessibilityRole="link"
                >
                    <Text style={styles.switchText}>
                        ¿Primera vez? <Text style={styles.switchHighlight}>Crea tu cuaderno</Text>
                    </Text>
                </TouchableOpacity>
            </div>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoEmoji: {
        fontSize: 64,
        textAlign: 'center',
    },
    title: {
        fontSize: 36,
        fontWeight: typography.weightBold,
        color: colors.text,
        fontFamily: typography.fontTitle,
        letterSpacing: 4,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: typography.sizeBody,
        color: colors.text,
        opacity: 0.6,
        fontFamily: typography.fontBody,
        marginBottom: spacing.xl,
        textAlign: 'center',
    },

    // Form Card
    formCard: {
        width: '100%' as any,
        backgroundColor: colors.glass,
        borderRadius: borders.radiusLarge,
        padding: spacing.xl,
        gap: spacing.lg,
        borderWidth: 1,
        borderColor: colors.glassBorder,
        ...shadows.glass,
        //@ts-ignore
        backdropFilter: 'blur(20px)',
    },

    // Inputs
    inputGroup: {
        gap: spacing.xs,
    },
    inputLabel: {
        fontSize: typography.sizeSmall,
        color: colors.text,
        fontWeight: typography.weightBold,
        fontFamily: typography.fontBody,
    },
    input: {
        backgroundColor: 'rgba(253, 251, 247, 0.6)',
        borderRadius: borders.radiusMedium,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        fontSize: typography.sizeBody,
        color: colors.text,
        fontFamily: typography.fontBody,
        borderWidth: 1,
        borderColor: 'rgba(124, 154, 146, 0.2)',
        //@ts-ignore
        outlineStyle: 'none',
        //@ts-ignore
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    },
    inputError: {
        borderColor: colors.danger,
    },
    passwordRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    passwordInput: {
        flex: 1,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        borderRightWidth: 0,
    },
    eyeButton: {
        backgroundColor: 'rgba(253, 251, 247, 0.6)',
        borderTopRightRadius: borders.radiusMedium,
        borderBottomRightRadius: borders.radiusMedium,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        borderWidth: 1,
        borderColor: 'rgba(124, 154, 146, 0.2)',
        borderLeftWidth: 0,
        justifyContent: 'center',
    },
    eyeIcon: {
        fontSize: 18,
    },

    // Error
    errorContainer: {
        backgroundColor: 'rgba(200, 80, 80, 0.1)',
        borderRadius: borders.radiusMedium,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: 'rgba(200, 80, 80, 0.3)',
    },
    errorText: {
        fontSize: typography.sizeSmall,
        color: colors.danger,
        fontFamily: typography.fontBody,
        textAlign: 'center',
    },

    // Button
    loginButton: {
        backgroundColor: colors.primary,
        borderRadius: borders.radiusFull,
        paddingVertical: spacing.md + 2,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
        ...shadows.glass,
    },
    loginButtonDisabled: {
        opacity: 0.5,
    },
    loginButtonText: {
        fontSize: typography.sizeBody,
        color: colors.white,
        fontWeight: typography.weightBold,
        fontFamily: typography.fontBody,
    },

    // Demo hint
    demoHint: {
        alignItems: 'center',
    },
    demoText: {
        fontSize: typography.sizeSmall,
        color: colors.text,
        opacity: 0.4,
        fontFamily: typography.fontBody,
        fontStyle: 'italic',
    },

    // Switch link
    switchLink: {
        marginTop: spacing.xl,
        padding: spacing.md,
    },
    switchText: {
        fontSize: typography.sizeBody,
        color: colors.text,
        opacity: 0.7,
        fontFamily: typography.fontBody,
    },
    switchHighlight: {
        color: colors.primary,
        fontWeight: typography.weightBold,
        //@ts-ignore
        textDecorationLine: 'underline',
    },
});
