import React, { useRef, useState } from 'react';
import { Animated, PanResponder, StyleSheet, View, Dimensions } from 'react-native';
import { BirdCard } from '../types/types';
import { BirdCardView } from './BirdCardView';

interface DraggableCardProps {
    card: BirdCard;
    onDrop: (card: BirdCard, pos: { x: number, y: number }) => void;
    onDragStart?: (card: BirdCard) => void;
    onDragUpdate?: (pos: { x: number, y: number }) => void;
    onDragEnd?: () => void;
    isOverlay?: boolean;
    dropZoneY?: number;
}

export function DraggableCard({ card, onDrop, onDragStart, onDragUpdate, onDragEnd, isOverlay, dropZoneY = 400 }: DraggableCardProps) {
    const [isDragging, setIsDragging] = useState(false);

    const pan = useRef(new Animated.ValueXY()).current;
    const scale = useRef(new Animated.Value(1)).current;
    const zIndex = useRef(new Animated.Value(100)).current;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt, gesture) => {
                onDragStart?.(card);
                if (isOverlay) return;

                setIsDragging(true);
                pan.setOffset({
                    x: (pan.x as any)._value,
                    y: (pan.y as any)._value
                });
                pan.setValue({ x: 0, y: 0 });
                zIndex.setValue(1000);
                Animated.spring(scale, {
                    toValue: 1.1,
                    friction: 5,
                    useNativeDriver: false,
                }).start();
            },
            onPanResponderMove: (evt, gesture) => {
                if (isOverlay) return;

                onDragUpdate?.({ x: gesture.moveX, y: gesture.moveY });
                return Animated.event(
                    [null, { dx: pan.x, dy: pan.y }],
                    { useNativeDriver: false }
                )(evt, gesture);
            },
            onPanResponderRelease: (_, gesture) => {
                setIsDragging(false);
                onDragEnd?.();
                pan.flattenOffset();
                zIndex.setValue(100);
                Animated.spring(scale, {
                    toValue: 1,
                    friction: 5,
                    useNativeDriver: false,
                }).start();

                // Always trigger onDrop and let the parent handle boundaries
                onDrop(card, { x: gesture.moveX, y: gesture.moveY });
                pan.setValue({ x: 0, y: 0 });

                // We always animate back in case it wasn't a valid drop
                Animated.spring(pan, {
                    toValue: { x: 0, y: 0 },
                    friction: 5,
                    useNativeDriver: false,
                }).start();
            },
            onPanResponderTerminate: () => {
                setIsDragging(false);
                onDragEnd?.();
                zIndex.setValue(100);
                Animated.spring(pan, {
                    toValue: { x: 0, y: 0 },
                    friction: 5,
                    useNativeDriver: false,
                }).start();
            }
        })
    ).current;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    zIndex: zIndex as any,
                    elevation: isDragging ? 1000 : 1, // For Android
                    opacity: isOverlay ? 1 : (onDragUpdate ? (isDragging ? 0.01 : 1) : 1),
                    transform: [
                        { translateX: pan.x },
                        { translateY: pan.y },
                        { scale: scale }
                    ],
                },
            ]}
            {...(!isOverlay ? panResponder.panHandlers : {})}
        >
            <BirdCardView card={card} mode="mini" />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
});
