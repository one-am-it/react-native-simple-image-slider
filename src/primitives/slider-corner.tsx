import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

type SliderCornerProps = {
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    offset?: number;
};

function SliderCorner({ position, children, style, offset = 16 }: SliderCornerProps) {
    const positionStyles = StyleSheet.create({
        absolute: {
            zIndex: 1000,
            position: 'absolute',
            bottom: position === 'bottom-left' || position === 'bottom-right' ? offset : 'auto',
            top: position === 'top-left' || position === 'top-right' ? offset : 'auto',
            left: position === 'top-left' || position === 'bottom-left' ? offset : 'auto',
            right: position === 'top-right' || position === 'bottom-right' ? offset : 'auto',
        },
    });

    return <View style={[positionStyles.absolute, style]}>{children}</View>;
}

export type { SliderCornerProps };
export { SliderCorner };
