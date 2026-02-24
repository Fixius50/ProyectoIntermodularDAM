import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { GlassCard } from '../components/GlassCard';
import { useGame } from '../context/GameContext';
import { CraftItem, CraftItemType } from '../types/types';
import { colors, typography, spacing, borders, shadows } from '../theme/theme';

// CSS animations for Taller effects
const tallerAnimCSS = `
@keyframes watercolorReveal {
  0%   { filter: blur(10px) saturate(0); opacity: 0.3; transform: scale(0.8); }
  30%  { filter: blur(5px) saturate(0.5); opacity: 0.6; }
  60%  { filter: blur(2px) saturate(0.8); opacity: 0.85; }
  100% { filter: blur(0) saturate(1); opacity: 1; transform: scale(1); }
}
@keyframes emptySlotPulse {
  0%, 100% { border-color: rgba(253, 251, 247, 0.3); }
  50%      { border-color: rgba(253, 251, 247, 0.6); }
}
@keyframes craftGlow {
  0%, 100% { box-shadow: 0 0 10px rgba(243, 156, 18, 0.2); }
  50%      { box-shadow: 0 0 25px rgba(243, 156, 18, 0.6); }
}
@keyframes popupSlide {
  0%   { transform: translateY(8px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
`;

// Los 3 slots necesarios para craftear
const REQUIRED_SLOTS: { type: CraftItemType; icon: string; label: string }[] = [
    { type: 'FOTO', icon: '📸', label: 'Foto' },
    { type: 'PLUMA', icon: '🪶', label: 'Pluma' },
    { type: 'NOTAS', icon: '📝', label: 'Notas' },
];

/**
 * Pantalla del Taller (Crafting)
 * Objetivo: Combinar materiales para crear cartas.
 * - Mesa de madera con 3 slots de crafting
 * - Inventario inferior con los objetos del jugador
 * - Al completar 3 materiales → Registrar Ave
 */
export function TallerScreen() {
    const { state, dispatch } = useGame();
    const { player } = state;

    const [slots, setSlots] = useState<(CraftItem | null)[]>([null, null, null]);
    const [craftResult, setCraftResult] = useState<'none' | 'crafting' | 'success'>('none');
    const [hintPopup, setHintPopup] = useState<CraftItemType | null>(null);

    // Objetos del inventario no colocados en slots
    const usedIds = slots.filter(Boolean).map((s) => s!.id);
    const availableItems = player.craftItems.filter((item) => !usedIds.includes(item.id));

    const handlePlaceItem = useCallback((item: CraftItem) => {
        const slotIndex = REQUIRED_SLOTS.findIndex((s) => s.type === item.type);
        if (slotIndex === -1) return;
        if (slots[slotIndex] !== null) return; // Slot ya ocupado

        const newSlots = [...slots];
        newSlots[slotIndex] = item;
        setSlots(newSlots);
    }, [slots]);

    const handleRemoveItem = useCallback((index: number) => {
        const newSlots = [...slots];
        newSlots[index] = null;
        setSlots(newSlots);
    }, [slots]);

    const allSlotsFilled = slots.every((s) => s !== null);

    const handleCraft = useCallback(() => {
        if (!allSlotsFilled) return;
        setCraftResult('crafting');

        // Simular animación de crafting
        setTimeout(() => {
            // Eliminar los items usados del inventario
            slots.forEach((item) => {
                if (item) dispatch({ type: 'REMOVE_CRAFT_ITEM', payload: item.id });
            });
            setSlots([null, null, null]);
            setCraftResult('success');

            // Resetear después de mostrar resultado
            setTimeout(() => setCraftResult('none'), 3000);
        }, 2000);
    }, [allSlotsFilled, slots, dispatch]);

    // Mensajes de pista para cada slot vacío
    const slotHints: Record<CraftItemType, string> = {
        FOTO: '¡Ve a Expedición y haz avistamientos para conseguir fotos!',
        PLUMA: '¡Gana certámenes para conseguir plumas!',
        NOTAS: '¡Completa expediciones para obtener notas de campo!',
    };

    const handleEmptySlotTap = useCallback((type: CraftItemType) => {
        setHintPopup(type);
        setTimeout(() => setHintPopup(null), 3000);
    }, []);

    return (
        <View style={styles.container}>
            <style>{tallerAnimCSS}</style>

            {/* Título */}
            <Text style={styles.title}>🔨 Taller del Naturalista</Text>
            <Text style={styles.subtitle}>Combina materiales para crear cartas de aves</Text>

            {/* Mesa de Crafting */}
            <View style={styles.craftingDesk}>
                <View style={styles.deskSurface}>
                    <Text style={styles.deskLabel}>Mesa de Trabajo</Text>

                    {/* 3 Slots */}
                    <View style={styles.slotsRow}>
                        {REQUIRED_SLOTS.map((req, index) => {
                            const item = slots[index];
                            const isFilled = item !== null;
                            return (
                                <TouchableOpacity
                                    key={req.type}
                                    style={[
                                        styles.craftSlot,
                                        isFilled && styles.craftSlotFilled,
                                        allSlotsFilled && styles.craftSlotGlow,
                                    ]}
                                    onPress={() => isFilled ? handleRemoveItem(index) : handleEmptySlotTap(req.type)}
                                    accessibilityLabel={
                                        isFilled
                                            ? `Slot de ${req.label} — ${item.label} colocada. Toca para quitar`
                                            : `Slot de ${req.label} — Vacío. Toca para ver cómo conseguir`
                                    }
                                    accessibilityRole="button"
                                >
                                    <div style={!isFilled ? { animation: 'emptySlotPulse 2s ease-in-out infinite' } : {}}>
                                        <Text style={styles.slotIcon}>{isFilled ? item.icon : req.icon}</Text>
                                    </div>
                                    <Text style={[styles.slotLabel, isFilled && styles.slotLabelFilled]}>
                                        {isFilled ? item.label : req.label}
                                    </Text>
                                    {!isFilled && <Text style={styles.slotHint}>Toca para pista</Text>}
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Popup de pista */}
                    {hintPopup && (
                        <div style={{
                            animation: 'popupSlide 0.3s ease-out',
                            marginTop: 8,
                            padding: '10px 14px',
                            borderRadius: 12,
                            background: 'rgba(255, 193, 7, 0.9)',
                            textAlign: 'center',
                        }}>
                            <Text style={{ fontSize: 13, color: '#333', fontWeight: '600', fontFamily: typography.fontBody }}>
                                💡 {slotHints[hintPopup]}
                            </Text>
                        </div>
                    )}

                    {/* Indicadores de unión */}
                    <View style={styles.joinersRow}>
                        <Text style={styles.joiner}>+</Text>
                        <Text style={styles.joiner}>+</Text>
                    </View>
                </View>

                {/* Botón Registrar / Estado */}
                {craftResult === 'none' && (
                    <TouchableOpacity
                        style={[styles.craftButton, !allSlotsFilled && styles.craftButtonDisabled]}
                        onPress={handleCraft}
                        disabled={!allSlotsFilled}
                        accessibilityLabel="Registrar ave con los materiales seleccionados"
                    >
                        <Text style={styles.craftButtonText}>
                            {allSlotsFilled ? '✨ Registrar Ave' : '🔒 Completa los 3 materiales'}
                        </Text>
                    </TouchableOpacity>
                )}

                {craftResult === 'crafting' && (
                    <GlassCard style={styles.craftingAnimation}>
                        <div style={{ animation: 'watercolorReveal 2s ease-out forwards' }}>
                            <Text style={styles.craftingEmoji}>🎨</Text>
                        </div>
                        <Text style={styles.craftingText}>Pintando carta con acuarelas...</Text>
                        <div style={{ animation: 'craftGlow 1s ease-in-out infinite' }}>
                            <Text style={styles.craftingDots}>● ● ●</Text>
                        </div>
                    </GlassCard>
                )}

                {craftResult === 'success' && (
                    <GlassCard style={styles.successCard}>
                        <Text style={styles.successEmoji}>🎉</Text>
                        <Text style={styles.successText}>¡Nueva carta obtenida!</Text>
                        <Text style={styles.successHint}>Revisa tu Álbum</Text>
                    </GlassCard>
                )}
            </View>

            {/* Inventario Inferior */}
            <View style={styles.inventorySection}>
                <Text style={styles.inventoryTitle}>📦 Inventario ({availableItems.length})</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.inventoryScroll}
                >
                    {availableItems.length === 0 ? (
                        <Text style={styles.emptyInventory}>
                            Sin materiales. ¡Ve a Expedición a recolectar!
                        </Text>
                    ) : (
                        availableItems.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.inventoryItem}
                                onPress={() => handlePlaceItem(item)}
                                accessibilityLabel={`Colocar ${item.label} en la mesa`}
                            >
                                <Text style={styles.inventoryIcon}>{item.icon}</Text>
                                <Text style={styles.inventoryLabel} numberOfLines={1}>{item.label}</Text>
                                <Text style={styles.inventoryType}>{item.type}</Text>
                            </TouchableOpacity>
                        ))
                    )}
                </ScrollView>
            </View>

            {/* Materiales info */}
            <View style={styles.materialsBar}>
                {player.materials.slice(0, 4).map((mat) => (
                    <View key={mat.type} style={styles.materialChip}>
                        <Text style={styles.materialIcon}>{mat.icon}</Text>
                        <Text style={styles.materialQty}>{mat.quantity}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#8B7355', // Fondo madera
        paddingTop: 48,
    },
    title: {
        fontSize: typography.sizeTitle,
        fontWeight: typography.weightBold,
        color: colors.background,
        textAlign: 'center',
        fontFamily: typography.fontTitle,
    },
    subtitle: {
        fontSize: typography.sizeCaption,
        color: 'rgba(253, 251, 247, 0.8)',
        textAlign: 'center',
        marginBottom: spacing.lg,
        fontFamily: typography.fontBody,
    },

    // Desk
    craftingDesk: {
        flex: 1,
        paddingHorizontal: spacing.lg,
    },
    deskSurface: {
        backgroundColor: 'rgba(139, 115, 85, 0.4)',
        borderRadius: borders.radiusLarge,
        padding: spacing.lg,
        borderWidth: 2,
        borderColor: 'rgba(253, 251, 247, 0.3)',
    },
    deskLabel: {
        fontSize: typography.sizeCaption,
        color: 'rgba(253, 251, 247, 0.6)',
        textAlign: 'center',
        marginBottom: spacing.md,
        fontFamily: typography.fontBody,
    },

    // Slots
    slotsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: spacing.sm,
    },
    craftSlot: {
        width: 95,
        height: 110,
        backgroundColor: 'rgba(253, 251, 247, 0.15)',
        borderRadius: borders.radiusMedium,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'rgba(253, 251, 247, 0.3)',
        borderStyle: 'dashed',
        gap: spacing.xs,
    },
    craftSlotFilled: {
        backgroundColor: 'rgba(253, 251, 247, 0.3)',
        borderStyle: 'solid',
        borderColor: colors.primary,
    },
    craftSlotGlow: {
        borderColor: colors.warning,
        backgroundColor: 'rgba(243, 156, 18, 0.15)',
    },
    slotIcon: {
        fontSize: 32,
    },
    slotLabel: {
        fontSize: typography.sizeSmall,
        color: 'rgba(253, 251, 247, 0.6)',
        fontFamily: typography.fontBody,
    },
    slotLabelFilled: {
        color: colors.background,
        fontWeight: typography.weightBold,
    },
    slotHint: {
        fontSize: 8,
        color: 'rgba(253, 251, 247, 0.4)',
    },

    // Joiners
    joinersRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 30,
        marginTop: -8,
        marginBottom: -8,
    },
    joiner: {
        fontSize: 20,
        color: 'rgba(253, 251, 247, 0.4)',
        fontWeight: typography.weightBold,
    },

    // Craft Button
    craftButton: {
        backgroundColor: colors.primary,
        borderRadius: borders.radiusFull,
        paddingVertical: spacing.lg,
        alignItems: 'center',
        marginTop: spacing.xl,
        ...shadows.glass,
    },
    craftButtonDisabled: {
        backgroundColor: 'rgba(124, 154, 146, 0.4)',
    },
    craftButtonText: {
        color: colors.white,
        fontSize: typography.sizeSubtitle,
        fontWeight: typography.weightBold,
        fontFamily: typography.fontBody,
    },

    // Crafting Animation
    craftingAnimation: {
        alignItems: 'center',
        marginTop: spacing.xl,
        gap: spacing.sm,
    },
    craftingEmoji: {
        fontSize: 48,
    },
    craftingText: {
        fontSize: typography.sizeBody,
        color: colors.text,
        fontFamily: typography.fontBody,
    },
    craftingDots: {
        fontSize: typography.sizeTitle,
        color: colors.primary,
    },

    // Success
    successCard: {
        alignItems: 'center',
        marginTop: spacing.xl,
        gap: spacing.sm,
        backgroundColor: 'rgba(39, 174, 96, 0.15)',
        borderColor: colors.success,
    },
    successEmoji: {
        fontSize: 48,
    },
    successText: {
        fontSize: typography.sizeSubtitle,
        fontWeight: typography.weightBold,
        color: colors.text,
        fontFamily: typography.fontBody,
    },
    successHint: {
        fontSize: typography.sizeCaption,
        color: colors.primaryDark,
        fontStyle: 'italic',
    },

    // Inventory
    inventorySection: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
    },
    inventoryTitle: {
        fontSize: typography.sizeCaption,
        fontWeight: typography.weightBold,
        color: colors.background,
        marginBottom: spacing.sm,
        fontFamily: typography.fontBody,
    },
    inventoryScroll: {
        gap: spacing.md,
        paddingBottom: spacing.xs,
    },
    inventoryItem: {
        backgroundColor: colors.glass,
        borderRadius: borders.radiusMedium,
        padding: spacing.md,
        alignItems: 'center',
        width: 80,
        gap: 2,
        ...shadows.card,
        //@ts-ignore
        backdropFilter: 'blur(10px)',
    },
    inventoryIcon: {
        fontSize: 28,
    },
    inventoryLabel: {
        fontSize: 9,
        color: colors.text,
        fontFamily: typography.fontBody,
    },
    inventoryType: {
        fontSize: 8,
        color: colors.primary,
        fontWeight: typography.weightBold,
    },
    emptyInventory: {
        fontSize: typography.sizeCaption,
        color: 'rgba(253, 251, 247, 0.6)',
        fontStyle: 'italic',
        paddingVertical: spacing.lg,
    },

    // Materials Bar
    materialsBar: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacing.md,
        paddingVertical: spacing.sm,
        backgroundColor: 'rgba(0,0,0,0.15)',
    },
    materialChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        backgroundColor: 'rgba(253, 251, 247, 0.15)',
        borderRadius: borders.radiusFull,
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
    },
    materialIcon: {
        fontSize: 14,
    },
    materialQty: {
        fontSize: typography.sizeSmall,
        color: colors.background,
        fontWeight: typography.weightBold,
    },
});
