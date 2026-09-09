import * as React from 'react';
import { StyleSheet, Text } from 'react-native';

import { useSlider } from '@one-am/react-native-simple-image-slider';

import { usePalette } from './theme';

function Caption() {
    const { currentIndex, totalItems } = useSlider();
    const palette = usePalette();

    return (
        <Text style={[styles.caption, { color: palette.onPhoto }]}>
            Photo {currentIndex + 1} of {totalItems}
        </Text>
    );
}

const styles = StyleSheet.create({
    caption: {
        fontSize: 14,
        fontWeight: '500',
    },
});

export { Caption };
