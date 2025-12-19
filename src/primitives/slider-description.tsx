import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSlider } from '../context/slider-context';
import type { SliderItem } from '../types/context';

type SliderDescriptionProps = {
    render: (item: SliderItem, index: number) => React.ReactNode;
    style?: StyleProp<ViewStyle>;
};

function SliderDescription({ render, style }: SliderDescriptionProps) {
    const { data, currentIndex } = useSlider();
    const safeAreaInsets = useSafeAreaInsets();

    const currentItem = data[currentIndex];

    if (!currentItem) {
        return null;
    }

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

    return (
        <View style={[positionStyles.descriptionContainer, style]}>
            {render(currentItem, currentIndex)}
        </View>
    );
}

export type { SliderDescriptionProps };
export { SliderDescription };
