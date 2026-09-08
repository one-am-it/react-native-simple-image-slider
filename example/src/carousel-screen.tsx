import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
    Slider,
    SliderCloseButton,
    SliderContent,
    SliderCorner,
    SliderDescription,
    SliderEmpty,
    SliderFullScreen,
    SliderPageCounter,
    SliderProvider,
    useSlider,
} from '@one-am/react-native-simple-image-slider';

import type { PhotoSource } from './photos';
import { bundledPhotos, remotePhotos } from './photos';
import { SegmentedControl } from './segmented-control';
import { usePalette } from './theme';

const SOURCES = [
    { value: 'bundled', label: 'Bundled' },
    { value: 'remote', label: 'Remote' },
] as const;

function Caption() {
    const { currentIndex, totalItems } = useSlider();
    const palette = usePalette();

    return (
        <Text style={[styles.caption, { color: palette.onPhoto }]}>
            Photo {currentIndex + 1} of {totalItems}
        </Text>
    );
}

function CarouselScreen() {
    const palette = usePalette();
    const [source, setSource] = React.useState<PhotoSource>('bundled');
    const [showEmpty, setShowEmpty] = React.useState(false);

    const photos = source === 'bundled' ? bundledPhotos : remotePhotos;
    const toggleEmpty = React.useCallback(() => setShowEmpty((previous) => !previous), []);

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: palette.text }]}>Carousel</Text>
                <Text style={[styles.subtitle, { color: palette.muted }]}>
                    Swipe through the photos, or tap one to open it full screen.
                </Text>
            </View>

            <View
                style={[
                    styles.card,
                    { backgroundColor: palette.surface, borderColor: palette.border },
                ]}
            >
                <SliderProvider data={showEmpty ? [] : photos} imageAspectRatio={4 / 3}>
                    <Slider>
                        <SliderContent />
                        <SliderEmpty style={styles.empty}>
                            <Text style={[styles.emptyText, { color: palette.muted }]}>
                                No photos available
                            </Text>
                        </SliderEmpty>
                        <SliderCorner position="bottom-left">
                            <SliderPageCounter />
                        </SliderCorner>
                    </Slider>
                    <SliderFullScreen>
                        <SliderContent enablePinchToZoom />
                        <SliderCloseButton />
                        <SliderDescription>
                            <Caption />
                        </SliderDescription>
                    </SliderFullScreen>
                </SliderProvider>
            </View>

            <SegmentedControl options={SOURCES} value={source} onChange={setSource} />

            <Pressable
                onPress={toggleEmpty}
                accessibilityRole="button"
                style={[styles.button, { borderColor: palette.border }]}
            >
                <Text style={[styles.buttonText, { color: palette.accent }]}>
                    {showEmpty ? 'Show the photos' : 'Show the empty state'}
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        gap: 16,
    },
    header: {
        gap: 4,
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
    },
    subtitle: {
        fontSize: 14,
    },
    card: {
        borderRadius: 16,
        borderWidth: StyleSheet.hairlineWidth,
        overflow: 'hidden',
    },
    empty: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
    },
    button: {
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: StyleSheet.hairlineWidth,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 15,
        fontWeight: '600',
    },
    caption: {
        fontSize: 14,
        fontWeight: '500',
    },
});

export { CarouselScreen };
