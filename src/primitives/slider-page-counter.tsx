import React from 'react';
import type { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { useSlider } from '../context/slider-context';

type SliderPageCounterProps = {
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    render?: (current: number, total: number) => ReactElement;
};

function SliderPageCounter({ style, textStyle, render }: SliderPageCounterProps) {
    const { currentIndex, totalItems } = useSlider();

    const currentPage = currentIndex + 1;

    if (render) {
        return render(currentPage, totalItems);
    }

    return (
        <View style={[styles.container, style]}>
            <Text style={[styles.text, textStyle]}>
                {currentPage} / {totalItems}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#D3D3D3',
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 5,
        width: 75,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#000000',
    },
});

export type { SliderPageCounterProps };
export { SliderPageCounter };
