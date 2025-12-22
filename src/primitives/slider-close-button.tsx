import React, { useMemo } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSlider } from '../context/slider-context';
import IconX from '../icons/icon-x';

type SliderCloseButtonProps = {
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    accessibilityLabel?: string;
    accessibilityHint?: string;
};

function SliderCloseButton({
    children,
    style,
    accessibilityLabel = 'Close full screen',
    accessibilityHint = 'Closes the full screen view',
}: SliderCloseButtonProps) {
    const { closeFullScreen } = useSlider();
    const safeAreaInsets = useSafeAreaInsets();

    const positionStyles = useMemo(
        () =>
            StyleSheet.create({
                closeButton: {
                    position: 'absolute',
                    zIndex: 1000,
                    top: safeAreaInsets.top,
                    right: safeAreaInsets.right + 20,
                },
            }),
        [safeAreaInsets.right, safeAreaInsets.top]
    );

    return (
        <TouchableOpacity
            style={[positionStyles.closeButton, style]}
            onPress={closeFullScreen}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel}
            accessibilityHint={accessibilityHint}
        >
            {children ?? <IconX color="#FFFFFF" />}
        </TouchableOpacity>
    );
}

export type { SliderCloseButtonProps };
export { SliderCloseButton };
