import * as React from 'react';

import {
    Slider,
    SliderContent,
    SliderCorner,
    SliderPageCounter,
    SliderFullScreen,
    SliderCloseButton,
    SliderDescription,
    SliderEmpty,
    useSlider,
    SliderProvider,
} from '@one-am/react-native-simple-image-slider';

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const REMOTE_PHOTO_COUNT = 30;

const remotePhotos = Array.from({ length: REMOTE_PHOTO_COUNT }, (_, i) => ({
    key: `remote-${i + 1}`,
    source: { uri: `https://picsum.photos/seed/${i + 1}/800/600` },
}));

const localPhotos = [
    require('../assets/photos/1.jpg'),
    require('../assets/photos/2.jpg'),
    require('../assets/photos/3.jpg'),
    require('../assets/photos/4.jpg'),
    require('../assets/photos/5.jpg'),
    require('../assets/photos/6.jpg'),
    require('../assets/photos/7.jpg'),
    require('../assets/photos/8.jpg'),
    require('../assets/photos/9.jpg'),
    require('../assets/photos/10.jpg'),
    require('../assets/photos/11.jpg'),
    require('../assets/photos/12.jpg'),
    require('../assets/photos/13.jpg'),
    require('../assets/photos/14.jpg'),
].map((source, i) => ({ key: `local-${i + 1}`, source }));

type ImageSource = 'remote' | 'local';

function PictureDescription() {
    const { currentIndex } = useSlider();
    return <Text style={{ color: '#ffffff' }}>Picture {currentIndex + 1}</Text>;
}

export default function App() {
    const [showEmpty, setShowEmpty] = React.useState(false);
    const [imageSource, setImageSource] = React.useState<ImageSource>('remote');

    const photos = imageSource === 'remote' ? remotePhotos : localPhotos;

    const handleToggleEmpty = React.useCallback(() => {
        setShowEmpty((prev) => !prev);
    }, []);

    const handleSelectSource = React.useCallback((source: ImageSource) => {
        setImageSource(source);
    }, []);

    const handleSelectRemote = React.useCallback(
        () => handleSelectSource('remote'),
        [handleSelectSource]
    );

    const handleSelectLocal = React.useCallback(
        () => handleSelectSource('local'),
        [handleSelectSource]
    );

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Pressable onPress={handleToggleEmpty} style={styles.toggleButton}>
                    <Text style={styles.toggleButtonText}>
                        {showEmpty ? 'Show Photos' : 'Show Empty'}
                    </Text>
                </Pressable>
                <SliderProvider data={showEmpty ? [] : photos} imageAspectRatio={4 / 3}>
                    <Slider>
                        <SliderContent />
                        <SliderEmpty style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No photos available</Text>
                        </SliderEmpty>
                        <SliderCorner position="bottom-left">
                            <SliderPageCounter />
                        </SliderCorner>
                    </Slider>
                    <SliderFullScreen>
                        <SliderContent enablePinchToZoom />
                        <SliderCloseButton />
                        <SliderDescription>
                            <PictureDescription />
                        </SliderDescription>
                    </SliderFullScreen>
                </SliderProvider>
                <View style={styles.controls}>
                    <View style={styles.segmentedControl}>
                        <Pressable
                            onPress={handleSelectRemote}
                            style={[
                                styles.segment,
                                imageSource === 'remote' && styles.segmentActive,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.segmentText,
                                    imageSource === 'remote' && styles.segmentTextActive,
                                ]}
                            >
                                Remote
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={handleSelectLocal}
                            style={[
                                styles.segment,
                                imageSource === 'local' && styles.segmentActive,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.segmentText,
                                    imageSource === 'local' && styles.segmentTextActive,
                                ]}
                            >
                                Local
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center',
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginTop: 20,
    },
    segmentedControl: {
        flex: 1,
        flexDirection: 'row',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#007AFF',
        overflow: 'hidden',
    },
    segment: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
    },
    segmentActive: {
        backgroundColor: '#007AFF',
    },
    segmentText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#007AFF',
    },
    segmentTextActive: {
        color: '#ffffff',
    },
    toggleButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginHorizontal: 20,
        marginBottom: 20,
        alignItems: 'center',
    },
    toggleButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
    emptyContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        color: '#666666',
    },
});
