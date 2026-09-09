import * as React from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import type { PhotoSource } from '../photos';
import { photoSet } from '../photos';
import { usePalette } from '../theme';
import { Tile } from './tile';

const COLUMNS = 3;
const GUTTER = 8;
const SCREEN_PADDING = 16;

const PHOTO_COUNT = 22;
const PHOTO_SOURCE: PhotoSource = 'bundled';
const PHOTOS = photoSet(PHOTO_COUNT, PHOTO_SOURCE);

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
                {PHOTOS.map((photo, index) => (
                    <Tile
                        key={photo.key}
                        photo={photo}
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
});

export { GalleryScreen };
