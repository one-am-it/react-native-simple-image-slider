import * as React from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { PhotoSource } from '../photos';
import { photoSet } from '../photos';
import { usePalette } from '../theme';
import type { RootStackParamList } from '../navigation-types';

const COLUMNS = 3;
const GUTTER = 8;
const SCREEN_PADDING = 16;

const PHOTO_COUNT = 22;
const PHOTO_SOURCE: PhotoSource = 'bundled';

function Tile({
    index,
    count,
    source,
    size,
}: {
    index: number;
    count: number;
    source: PhotoSource;
    size: number;
}) {
    const palette = usePalette();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const photo = React.useMemo(() => photoSet(count, source)[index], [count, source, index]);

    const open = React.useCallback(
        () => navigation.navigate('Photo', { index, count, source }),
        [navigation, index, count, source]
    );

    return (
        <Pressable
            onPress={open}
            accessibilityRole="imagebutton"
            accessibilityLabel={`Photo ${index + 1} of ${count}`}
            style={[styles.tile, { width: size, height: size, backgroundColor: palette.border }]}
        >
            <Image source={photo.source} contentFit="cover" style={styles.tileImage} />
            <View style={[styles.badge, { backgroundColor: palette.scrim }]}>
                <Text style={[styles.badgeText, { color: palette.onPhoto }]}>{index + 1}</Text>
            </View>
        </Pressable>
    );
}

function GalleryScreen() {
    const palette = usePalette();
    const { width } = useWindowDimensions();

    const tileSize = (width - SCREEN_PADDING * 2 - GUTTER * (COLUMNS - 1)) / COLUMNS;

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: palette.text }]}>Gallery</Text>
                <Text style={[styles.subtitle, { color: palette.muted }]}>
                    Tap a photo to open the pager on it.
                </Text>
            </View>

            <View style={styles.grid}>
                {Array.from({ length: PHOTO_COUNT }, (_, index) => (
                    <Tile
                        key={index}
                        index={index}
                        count={PHOTO_COUNT}
                        source={PHOTO_SOURCE}
                        size={tileSize}
                    />
                ))}
            </View>
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
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: GUTTER,
    },
    tile: {
        borderRadius: 10,
        overflow: 'hidden',
    },
    tileImage: {
        width: '100%',
        height: '100%',
    },
    badge: {
        position: 'absolute',
        left: 6,
        bottom: 6,
        paddingHorizontal: 7,
        paddingVertical: 2,
        borderRadius: 6,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600',
    },
});

export { GalleryScreen };
