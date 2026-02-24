/**
 * AVIS — Pantalla de Registro
 * Diseño glassmorphism con el Design System "Living Field Notebook".
 */
import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors, typography, spacing, borders, shadows } from '../theme/theme';

// CSS animations
const registerAnimCSS = `
@keyframes fadeSlideUp {
  0%   { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes shakeError {
  0%, 100% { transform: translateX(0); }
  20%      { transform: translateX(-8px); }
  40%      { transform: translateX(8px); }
  60%      { transform: translateX(-5px); }
  80%      { transform: translateX(5px); }
}
@keyframes checkPop {
  0%   { transform: scale(0); }
  50%  { transform: scale(1.3); }
  100% { transform: scale(1); }
}
`;

// Validación de contraseña
interface PasswordStrength {
    score: number; // 0-4
    label: string;
    color: string;
}

function evaluatePassword(pw: string): PasswordStrength {
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;

    const levels: PasswordStrength[] = [
        { score: 0, label: 'Muy débil', color: '#C85050' },
        { score: 1, label: 'Débil', color: '#D4844C' },
        { score: 2, label: 'Aceptable', color: '#C4A84C' },
        { score: 3, label: 'Buena', color: '#7C9A92' },
        { score: 4, label: 'Fuerte', color: '#5C8F7C' },
    ];
    return levels[score];
}

interface RegisterScreenProps {
    onNavigateToLogin: () => void;
}

export function RegisterScreen({ onNavigateToLogin }: RegisterScreenProps) {
    const { register, isLoading, state, clearError } = useAuth();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    const passwordStrength = useMemo(() => evaluatePassword(password), [password]);
    const passwordsMatch = password.length > 0 && password === confirmPassword;

    const handleRegister = useCallback(async () => {
        setLocalError(null);
        setHasError(false);

        if (username.trim().length < 3) {
            setLocalError('El nombre debe tener al menos 3 caracteres');
            setHasError(true);
            setTimeout(() => setHasError(false), 600);
            return;
        }
        if (password.length < 6) {
            setLocalError('La contraseña debe tener al menos 6 caracteres');
            setHasError(true);
            setTimeout(() => setHasError(false), 600);
            return;
        }
        if (password !== confirmPassword) {
            setLocalError('Las contraseñas no coinciden');
            setHasError(true);
            setTimeout(() => setHasError(false), 600);
            return;
        }

        try {
            await register(username.trim(), email.trim(), password);
        } catch {
            setHasError(true);
            setTimeout(() => setHasError(false), 600);
        }
    }, [username, email, password, confirmPassword, register]);

    const handleFieldChange = useCallback((setter: (v: string) => void) => (text: string) => {
        setter(text);
        setLocalError(null);
        if (state.error) clearError();
    }, [state.error, clearError]);

    const isFormValid = username.trim().length >= 3
        && email.trim().includes('@')
        && password.length >= 6
        && password === confirmPassword;

    const displayError = localError || state.error;

    return (
        <View style={styles.container}>
            <style>{registerAnimCSS}</style>

            {/* Background decorativo */}
            <div style={{
                position: 'absolute', inset: 0,
                background: `
                    radial-gradient(ellipse at 80% 20%, rgba(124, 154, 146, 0.15) 0%, transparent 60%),
                    radial-gradient(ellipse at 20% 80%, rgba(168, 197, 184, 0.1) 0%, transparent 50%),
                    linear-gradient(180deg, ${colors.background}, #E8E0D4)
                `,
                zIndex: 0,
            }} />

            <div style={{
                position: 'relative', zIndex: 1,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                width: '100%', maxWidth: 400, padding: '0 24px',
                animation: 'fadeSlideUp 0.6s ease-out',
                overflowY: 'auto', maxHeight: '100vh',
            }}>
                {/* Header */}
                <Text style={styles.logoEmoji}>📓</Text>
                <Text style={styles.title}>Nuevo Cuaderno</Text>
                <Text style={styles.subtitle}>Únete a la comunidad de naturalistas</Text>

                {/* Form */}
                <View style={styles.formCard}>
                    {/* Username */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>🏷️ Nombre de naturalista</Text>
                        <TextInput
                            style={styles.input}
                            value={username}
                            onChangeText={handleFieldChange(setUsername)}
                            placeholder="Tu nombre en el campo"
                            placeholderTextColor="rgba(74, 56, 42, 0.3)"
                            autoCapitalize="words"
                            accessibilityLabel="Nombre de usuario"
                            editable={!isLoading}
                        />
                    </View>

                    {/* Email */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>📧 Correo electrónico</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={handleFieldChange(setEmail)}
                            placeholder="tu@correo.com"
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
                                style={[styles.input, styles.passwordInput]}
                                value={password}
                                onChangeText={handleFieldChange(setPassword)}
                                placeholder="Mínimo 6 caracteres"
                                placeholderTextColor="rgba(74, 56, 42, 0.3)"
                                secureTextEntry={!showPassword}
                                autoComplete="new-password"
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

                        {/* Password strength indicator */}
                        {password.length > 0 && (
                            <View style={styles.strengthRow}>
                                <View style={styles.strengthBarContainer}>
                                    <div style={{
                                        height: 4, borderRadius: 2,
                                        width: `${(passwordStrength.score / 4) * 100}%`,
                                        backgroundColor: passwordStrength.color,
                                        transition: 'width 0.3s ease, background-color 0.3s ease',
                                    }} />
                                </View>
                                <Text style={[styles.strengthLabel, { color: passwordStrength.color }]}>
                                    {passwordStrength.label}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Confirm Password */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>🔐 Confirmar contraseña</Text>
                        <View style={styles.passwordRow}>
                            <TextInput
                                style={[styles.input, styles.passwordInput]}
                                value={confirmPassword}
                                onChangeText={handleFieldChange(setConfirmPassword)}
                                placeholder="Repite la contraseña"
                                placeholderTextColor="rgba(74, 56, 42, 0.3)"
                                secureTextEntry={!showPassword}
                                accessibilityLabel="Confirmar contraseña"
                                editable={!isLoading}
                            />
                            {confirmPassword.length > 0 && (
                                <div style={{
                                    animation: 'checkPop 0.3s ease',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    padding: '0 12px',
                                }}>
                                    <Text style={{ fontSize: 18 }}>
                                        {passwordsMatch ? '✅' : '❌'}
                                    </Text>
                                </div>
                            )}
                        </View>
                    </View>

                    {/* Error */}
                    {displayError && (
                        <div style={{ animation: 'shakeError 0.5s ease' }}>
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>⚠️ {displayError}</Text>
                            </View>
                        </div>
                    )}

                    {/* Register Button */}
                    <TouchableOpacity
                        style={[styles.registerButton, (!isFormValid || isLoading) && styles.registerButtonDisabled]}
                        onPress={handleRegister}
                        disabled={!isFormValid || isLoading}
                        accessibilityLabel="Crear cuenta"
                        accessibilityRole="button"
                    >
                        {isLoading ? (
                            <ActivityIndicator color={colors.white} size="small" />
                        ) : (
                            <Text style={styles.registerButtonText}>Crear mi cuaderno 📖</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Switch to Login */}
                <TouchableOpacity
                    style={styles.switchLink}
                    onPress={onNavigateToLogin}
                    accessibilityLabel="Ir a iniciar sesión"
                    accessibilityRole="link"
                >
                    <Text style={styles.switchText}>
                        ¿Ya tienes cuaderno? <Text style={styles.switchHighlight}>Inicia sesión</Text>
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
        fontSize: 52,
        textAlign: 'center',
        marginBottom: spacing.xs,
    },
    title: {
        fontSize: 28,
        fontWeight: typography.weightBold,
        color: colors.text,
        fontFamily: typography.fontTitle,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: typography.sizeCaption,
        color: colors.text,
        opacity: 0.6,
        fontFamily: typography.fontBody,
        marginBottom: spacing.lg,
        textAlign: 'center',
    },

    // Form Card
    formCard: {
        width: '100%' as any,
        backgroundColor: colors.glass,
        borderRadius: borders.radiusLarge,
        padding: spacing.xl,
        gap: spacing.md,
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

    // Strength
    strengthRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginTop: 4,
    },
    strengthBarContainer: {
        flex: 1,
        height: 4,
        backgroundColor: 'rgba(124, 154, 146, 0.15)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    strengthLabel: {
        fontSize: 10,
        fontWeight: typography.weightBold,
        fontFamily: typography.fontBody,
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
    registerButton: {
        backgroundColor: colors.primary,
        borderRadius: borders.radiusFull,
        paddingVertical: spacing.md + 2,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
        ...shadows.glass,
    },
    registerButtonDisabled: {
        opacity: 0.5,
    },
    registerButtonText: {
        fontSize: typography.sizeBody,
        color: colors.white,
        fontWeight: typography.weightBold,
        fontFamily: typography.fontBody,
    },

    // Switch link
    switchLink: {
        marginTop: spacing.lg,
        padding: spacing.md,
        marginBottom: spacing.xl,
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
