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
import { Pressable, StyleSheet, Text } from 'react-native';
import pictureOne from '../assets/photos/1.jpg';
import pictureTwo from '../assets/photos/2.jpg';
import pictureThree from '../assets/photos/3.jpg';
import pictureFour from '../assets/photos/4.jpg';
import pictureFive from '../assets/photos/5.jpg';
import pictureSix from '../assets/photos/6.jpg';
import pictureSeven from '../assets/photos/7.jpg';
import pictureEight from '../assets/photos/8.jpg';
import pictureNine from '../assets/photos/9.jpg';
import pictureTen from '../assets/photos/10.jpg';
import pictureEleven from '../assets/photos/11.jpg';
import pictureTwelve from '../assets/photos/12.jpg';
import pictureThirteen from '../assets/photos/13.jpg';
import pictureFourteen from '../assets/photos/14.jpg';

const photos = [
    pictureOne,
    pictureTwo,
    pictureThree,
    pictureFour,
    pictureFive,
    pictureSix,
    pictureSeven,
    pictureEight,
    pictureNine,
    pictureTen,
    pictureEleven,
    pictureTwelve,
    pictureThirteen,
    pictureFourteen,
];

function PictureDescription() {
    const { currentIndex } = useSlider();
    return <Text style={{ color: '#ffffff' }}>Picture {currentIndex + 1}</Text>;
}

export default function App() {
    const [showEmpty, setShowEmpty] = React.useState(false);

    const handleToggle = React.useCallback(() => {
        setShowEmpty((prev) => !prev);
    }, []);

    return (
        <SafeAreaProvider>
            <SafeAreaView
                style={{
                    flex: 1,
                    alignItems: 'stretch',
                    justifyContent: 'center',
                }}
            >
                <Pressable onPress={handleToggle} style={styles.toggleButton}>
                    <Text style={styles.toggleButtonText}>
                        {showEmpty ? 'Show Photos' : 'Show Empty'}
                    </Text>
                </Pressable>
                <SliderProvider
                    data={
                        showEmpty
                            ? []
                            : photos.map((photo, index) => ({
                                  source: photo,
                                  key: index.toString(),
                              }))
                    }
                >
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
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
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
        fontSize: 16,
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
