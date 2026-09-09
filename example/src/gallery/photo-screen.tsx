import * as React from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
    Slider,
    SliderContent,
    SliderDescription,
    SliderProvider,
    useSlider,
} from '@one-am/react-native-simple-image-slider';
import type { PinchToZoomStatus } from '@one-am/react-native-simple-image-slider';

import { photoSet } from '../photos';
import { usePalette } from '../theme';
import type { RootStackParamList } from '../navigation-types';

/** Where the library places its own close button, so this screen's sits in the same spot. */
const SAFE_AREA_OFFSET = 20;

/** How far the black behind the photo fades as it is dragged away, as the library's own does. */
const SCRIM_FADE = 0.8;

/** A pinch counts as over once the scale is back within this of 1. */
const REST_TOLERANCE = 0.01;

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
 * The pager is mounted at `initialIndex` rather than opened through `SliderFullScreen`, because a
 * grid has no other way in: the full screen opens on whatever photo the provider already shows, and
 * nothing public moves it there without an inline slider to scroll. Everything else is the library's
 * own — the close button's position, the bordered footer, the swipe-down dismiss and the scrim that
 * fades with it — so both tabs present a photo identically.
 */
function PhotoScreen() {
    const palette = usePalette();
    const insets = useSafeAreaInsets();
    const { height } = useWindowDimensions();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { index, count, source } = useRoute<RouteProp<RootStackParamList, 'Photo'>>().params;

    const photos = React.useMemo(() => photoSet(count, source), [count, source]);
    const close = React.useCallback(() => navigation.goBack(), [navigation]);

    // Chrome is hidden while the photo is in hand and comes back when it settles — what a consumer
    // does so a zoomed photo has the screen to itself.
    const [zoomed, setZoomed] = React.useState(false);

    const scrimOpacity = useSharedValue(1);
    const scrimStyle = useAnimatedStyle(
        () => ({ backgroundColor: `rgba(0, 0, 0, ${scrimOpacity.value})` }),
        []
    );

    const trackPinch = React.useCallback(
        ({ scale, translation }: PinchToZoomStatus) => {
            setZoomed(Math.abs(scale - 1) > REST_TOLERANCE);

            // The scrim only follows a drag — a zoomed photo keeps its backdrop.
            if (scale > 1) {
                scrimOpacity.value = 1;
                return;
            }

            const progress = Math.min(Math.abs(translation.y) / (height / 2), 1);
            scrimOpacity.value = 1 - progress * SCRIM_FADE;
        },
        [height, scrimOpacity]
    );

    return (
        <Animated.View style={[styles.screen, scrimStyle]}>
            <SliderProvider
                data={photos}
                initialIndex={index}
                imageAspectRatio={4 / 3}
                onPinchStatusChange={trackPinch}
                onPinchDismiss={close}
            >
                <Slider>
                    <SliderContent enablePinchToZoom />
                </Slider>
                <SliderDescription style={zoomed ? styles.hidden : undefined}>
                    <Caption />
                </SliderDescription>
            </SliderProvider>
            <Pressable
                onPress={close}
                accessibilityRole="button"
                accessibilityLabel="Close"
                style={[
                    styles.close,
                    { top: insets.top, right: insets.right + SAFE_AREA_OFFSET },
                    zoomed ? styles.hidden : undefined,
                ]}
            >
                <CloseIcon color={palette.onPhoto} />
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    caption: {
        fontSize: 14,
        fontWeight: '500',
    },
    close: {
        position: 'absolute',
        zIndex: 1000,
    },
    hidden: {
        opacity: 0,
    },
});

export { PhotoScreen };
