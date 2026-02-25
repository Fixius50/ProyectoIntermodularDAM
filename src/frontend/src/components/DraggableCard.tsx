import React, { useRef } from 'react';
import { Animated, PanResponder, StyleSheet, View } from 'react-native';
import { BirdCard } from '../types/types';
import { BirdCardView } from './BirdCardView';

interface DraggableCardProps {
    card: BirdCard;
    onDrop: (card: BirdCard) => void;
    onDragStart?: () => void;
    onDragEnd?: () => void;
    dropZoneY?: number;
}

export function DraggableCard({ card, onDrop, onDragStart, onDragEnd, dropZoneY = 400 }: DraggableCardProps) {
    const pan = useRef(new Animated.ValueXY()).current;
    const scale = useRef(new Animated.Value(1)).current;
    const zIndex = useRef(new Animated.Value(100)).current;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                onDragStart?.();
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
            onPanResponderMove: Animated.event(
                [null, { dx: pan.x, dy: pan.y }],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: (_, gesture) => {
                onDragEnd?.();
                pan.flattenOffset();
                zIndex.setValue(100);
                Animated.spring(scale, {
                    toValue: 1,
                    friction: 5,
                    useNativeDriver: false,
                }).start();

                // Detect if dragged "UP" sufficiently (negative dy)
                if (gesture.dy < -100) {
                    onDrop(card);
                    pan.setValue({ x: 0, y: 0 });
                } else {
                    Animated.spring(pan, {
                        toValue: { x: 0, y: 0 },
                        friction: 5,
                        useNativeDriver: false,
                    }).start();
                }
            },
            onPanResponderTerminate: () => {
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
                    transform: [
                        { translateX: pan.x },
                        { translateY: pan.y },
                        { scale: scale }
                    ],
                },
            ]}
            {...panResponder.panHandlers}
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
