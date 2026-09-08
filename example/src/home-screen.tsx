import * as React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CarouselScreen } from './carousel-screen';
import { GalleryScreen } from './gallery/gallery-screen';
import { SegmentedControl } from './segmented-control';
import { usePalette } from './theme';

type Mode = 'carousel' | 'gallery';

const MODES = [
    { value: 'carousel', label: 'Carousel' },
    { value: 'gallery', label: 'Gallery' },
] as const;

function HomeScreen() {
    const palette = usePalette();
    const [mode, setMode] = React.useState<Mode>('carousel');

    return (
        <SafeAreaView
            style={[styles.screen, { backgroundColor: palette.background }]}
            edges={['top']}
        >
            <View style={styles.tabs}>
                <SegmentedControl options={MODES} value={mode} onChange={setMode} />
            </View>
            <ScrollView contentContainerStyle={styles.content}>
                {mode === 'carousel' ? <CarouselScreen /> : <GalleryScreen />}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    tabs: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 12,
    },
    content: {
        paddingHorizontal: 16,
        paddingBottom: 32,
    },
});

export type { Mode };
export { HomeScreen };
