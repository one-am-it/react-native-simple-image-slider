import React from 'react';
import type { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { useSlider } from '../context/slider-context';

export type SliderPageCounterProps = {
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    render?: (current: number, total: number) => ReactElement;
    offset?: number;
};

function SliderPageCounter({
    position = 'bottom-left',
    style,
    textStyle,
    render,
    offset = 16,
}: SliderPageCounterProps) {
    const { currentIndex, totalItems } = useSlider();

    const currentPage = currentIndex + 1;

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

    if (render) {
        return <View style={positionStyles.absolute}>{render(currentPage, totalItems)}</View>;
    }

    return (
        <View style={[positionStyles.absolute, styles.container, style]}>
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

export default SliderPageCounter;
