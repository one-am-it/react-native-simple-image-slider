import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSlider } from '../context/slider-context';
import IconX from '../icons/icon-x';

type SliderCloseButtonProps = {
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
};

function SliderCloseButton({ children, style }: SliderCloseButtonProps) {
    const { closeFullScreen } = useSlider();
    const safeAreaInsets = useSafeAreaInsets();

    const positionStyles = StyleSheet.create({
        closeButton: {
            position: 'absolute',
            zIndex: 1000,
            top: safeAreaInsets.top,
            right: safeAreaInsets.right + 20,
        },
    });

    return (
        <TouchableOpacity style={[positionStyles.closeButton, style]} onPress={closeFullScreen}>
            {children ?? <IconX color="#FFFFFF" />}
        </TouchableOpacity>
    );
}

export type { SliderCloseButtonProps };
export { SliderCloseButton };
