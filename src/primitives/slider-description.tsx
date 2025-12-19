import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type SliderDescriptionProps = {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
};

function SliderDescription({ children, style }: SliderDescriptionProps) {
    const safeAreaInsets = useSafeAreaInsets();

    const positionStyles = StyleSheet.create({
        descriptionContainer: {
            position: 'absolute',
            borderTopWidth: 1,
            borderTopColor: '#FFFFFF',
            width: '100%',
            paddingTop: 20,
            bottom: safeAreaInsets.bottom + 100,
            paddingLeft: safeAreaInsets.left + 20,
            paddingRight: safeAreaInsets.right + 20,
        },
    });

    return <View style={[positionStyles.descriptionContainer, style]}>{children}</View>;
}

export type { SliderDescriptionProps };
export { SliderDescription };
