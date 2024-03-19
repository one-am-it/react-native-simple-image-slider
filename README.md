# react-native-simple-image-slider

A simple and performant image slider made with [`@shopify/flash-list`](https://github.com/Shopify/flash-list)
and [expo-image](https://docs.expo.dev/versions/latest/sdk/image/)
Includes a full screen gallery component with gesture support.

![Alt Text](docs/slider-demo.gif)

## Installation

#### Expo

```shell
npx expo install expo-image expo-haptics expo-status-bar react-native-reanimated \
 react-native-gesture-handler react-native-safe-area-context styled-components \
  @one-am/react-native-simple-image-slider
```

#### Non-Expo

##### npm

```shell
npm install expo-image expo-haptics expo-status-bar react-native-reanimated \
 react-native-gesture-handler react-native-safe-area-context styled-components \
  @one-am/react-native-simple-image-slider
```

##### yarn

```shell
yarn add expo-image expo-haptics expo-status-bar react-native-reanimated \
 react-native-gesture-handler react-native-safe-area-context styled-components \
  @one-am/react-native-simple-image-slider
```

## Usage

```typescript jsx
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

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useWindowDimensions } from 'react-native';

const photos = [pictureOne, pictureTwo, pictureThree, pictureFour, pictureFive];

const StyledContainer = styled(SafeAreaView)`
    flex: 1;
    align-items: center;
    justify-content: center;
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
          />
        </SimpleImageSliderThemeProvider>
      </StyledContainer>
    </SafeAreaProvider>
  );
}
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
