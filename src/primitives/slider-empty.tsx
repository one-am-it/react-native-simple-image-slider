import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { useSlider } from '../context/slider-context';

type SliderEmptyProps = {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
};

const SliderEmpty = React.memo<SliderEmptyProps>(function SliderEmpty({ children, style }) {
    const { totalItems, imageAspectRatio } = useSlider();

    return totalItems === 0 ? (
        <View style={[styles.container, { aspectRatio: imageAspectRatio }, style]}>{children}</View>
    ) : null;
});

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
});

export type { SliderEmptyProps };
export { SliderEmpty };
