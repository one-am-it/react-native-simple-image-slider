import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { SliderItem } from '@one-am/react-native-simple-image-slider';

import type { PhotoSource } from '../photos';
import { usePalette } from '../theme';
import type { RootStackParamList } from '../navigation-types';

type TileProps = {
    photo: SliderItem;
    index: number;
    count: number;
    source: PhotoSource;
    size: number;
};

function Tile({ photo, index, count, source, size }: TileProps) {
    const palette = usePalette();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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

const styles = StyleSheet.create({
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

export type { TileProps };
export { Tile };
