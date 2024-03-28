import * as React from 'react';

import {
    SimpleImageSliderThemeProvider,
    SimpleImageSlider,
} from '@one-am/react-native-simple-image-slider';
import styled from 'styled-components/native';

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

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Text, useWindowDimensions } from 'react-native';

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

const StyledContainer = styled(SafeAreaView)`
    flex: 1;
    align-items: center;
    justify-content: center;
`;

const StyledDescription = styled(Text)`
    color: #ffffff;
`;

export default function App() {
    const { width } = useWindowDimensions();
    return (
        <SafeAreaProvider>
            <StyledContainer>
                <SimpleImageSliderThemeProvider>
                    <SimpleImageSlider
                        data={photos.map((photo, index) => ({
                            source: photo,
                            key: index.toString(),
                        }))}
                        imageWidth={width}
                        imageAspectRatio={16 / 9}
                        fullScreenEnabled={true}
                        renderFullScreenDescription={(_, index) => (
                            <StyledDescription>Picture {index}</StyledDescription>
                        )}
                    />
                </SimpleImageSliderThemeProvider>
            </StyledContainer>
        </SafeAreaProvider>
    );
}
