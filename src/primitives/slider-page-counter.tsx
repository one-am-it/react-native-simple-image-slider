import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { useSlider } from '../context/slider-context';

type SliderPageCounterProps = {
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    accessibilityLabel?: string | ((current: number, total: number) => string);
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
};

const SliderPageCounter = React.memo<SliderPageCounterProps>(function SliderPageCounter({
    style,
    textStyle,
    accessibilityLabel,
    backgroundColor = '#D3D3D3',
    borderColor = '#000000',
    textColor = '#000000',
}) {
    const { currentIndex, totalItems } = useSlider();

    if (totalItems === 0) {
        return null;
    }

    const currentPage = currentIndex + 1;

    const label =
        typeof accessibilityLabel === 'function'
            ? accessibilityLabel(currentPage, totalItems)
            : (accessibilityLabel ?? `Image ${currentPage} of ${totalItems}`);

    return (
        <View
            style={[styles.container, { backgroundColor, borderColor }, style]}
            accessible={true}
            accessibilityRole="text"
            accessibilityLabel={label}
            accessibilityLiveRegion="polite"
        >
            <Text style={[styles.text, { color: textColor }, textStyle]}>
                {currentPage} / {totalItems}
            </Text>
        </View>
    );
});

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
