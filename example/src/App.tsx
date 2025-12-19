import * as React from 'react';

import {
    Slider,
    SliderContent,
    SliderCorner,
    SliderPageCounter,
    SliderFullScreen,
    SliderCloseButton,
    SliderDescription,
    useSlider,
} from '@one-am/react-native-simple-image-slider';

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native';
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
    return (
        <SafeAreaProvider>
            <SafeAreaView
                style={{
                    flex: 1,
                    alignItems: 'stretch',
                    justifyContent: 'center',
                }}
            >
                <Slider
                    data={photos.map((photo, index) => ({
                        source: photo,
                        key: index.toString(),
                    }))}
                >
                    <SliderContent />
                    <SliderCorner position="bottom-left">
                        <SliderPageCounter />
                    </SliderCorner>
                    <SliderFullScreen>
                        <SliderContent enablePinchToZoom />
                        <SliderCloseButton />
                        <SliderDescription>
                            <PictureDescription />
                        </SliderDescription>
                    </SliderFullScreen>
                </Slider>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
