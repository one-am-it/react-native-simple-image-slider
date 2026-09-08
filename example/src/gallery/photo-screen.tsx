import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
    Slider,
    SliderContent,
    SliderProvider,
    useSlider,
} from '@one-am/react-native-simple-image-slider';

import { photoSet } from '../photos';
import { usePalette } from '../theme';
import type { RootStackParamList } from '../navigation-types';

/** The library places its own close button here, and this screen is its own, so it matches. */
const SAFE_AREA_OFFSET = 20;

function CloseIcon({ color }: { color: string }) {
    return (
        <Svg width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} stroke={color} fill="none">
            <Path d="M18 6l-12 12" />
            <Path d="M6 6l12 12" />
        </Svg>
    );
}

function Caption() {
    const { currentIndex, totalItems } = useSlider();
    const palette = usePalette();

    return (
        <Text style={[styles.caption, { color: palette.onPhoto }]}>
            Photo {currentIndex + 1} of {totalItems}
        </Text>
    );
}

/**
 * A photo opened from the grid, on its own screen.
 *
 * The pager is mounted at `initialIndex` rather than opened through `SliderFullScreen`, because
 * that is the only way in: the full screen opens on whatever photo the provider is already showing,
 * and nothing public moves it there without an inline slider to scroll.
 */
function PhotoScreen() {
    const palette = usePalette();
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { index, count, source } = useRoute<RouteProp<RootStackParamList, 'Photo'>>().params;

    const photos = React.useMemo(() => photoSet(count, source), [count, source]);
    const close = React.useCallback(() => navigation.goBack(), [navigation]);

    return (
        <View style={styles.screen}>
            <SliderProvider data={photos} initialIndex={index} imageAspectRatio={4 / 3}>
                <Slider>
                    <SliderContent enablePinchToZoom />
                </Slider>
                <View style={styles.chrome}>
                    <Caption />
                </View>
            </SliderProvider>
            <Pressable
                onPress={close}
                accessibilityRole="button"
                accessibilityLabel="Close"
                style={[styles.close, { top: insets.top, right: insets.right + SAFE_AREA_OFFSET }]}
            >
                <CloseIcon color={palette.onPhoto} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#000000',
    },
    chrome: {
        alignItems: 'center',
        paddingTop: 16,
    },
    caption: {
        fontSize: 14,
        fontWeight: '500',
    },
    close: {
        position: 'absolute',
        zIndex: 1000,
    },
});

export { PhotoScreen };
