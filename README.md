# react-native-simple-image-slider
[![NPM Version](https://img.shields.io/npm/v/@one-am/react-native-simple-image-slider.svg?style=flat)](https://www.npmjs.com/package/@one-am/react-native-simple-image-slider)
[![NPM License](https://img.shields.io/npm/l/@one-am/react-native-simple-image-slider.svg?style=flat)](LICENSE)
[![NPM Downloads](https://img.shields.io/npm/dt/@one-am/react-native-simple-image-slider.svg?style=flat)](https://www.npmjs.com/package/@one-am/react-native-simple-image-slider)

A simple and performant image slider made with [`@shopify/flash-list`](https://github.com/Shopify/flash-list)
and [expo-image](https://docs.expo.dev/versions/latest/sdk/image/)
Includes a full screen gallery component with gesture support.

![Alt Text](docs/slider-demo.gif)

## Installation

#### Expo

##### npm

```shell
npx expo install @shopify/flash-list expo-image expo-haptics expo-status-bar react-native-reanimated react-native-svg \
 react-native-gesture-handler react-native-safe-area-context @one-am/react-native-simple-image-slider
```

##### yarn

```shell
yarn dlx expo install @shopify/flash-list expo-image expo-haptics expo-status-bar react-native-reanimated react-native-svg \
 react-native-gesture-handler react-native-safe-area-context @one-am/react-native-simple-image-slider
```

#### Non-Expo

##### npm

```shell
npm install @shopify/flash-list expo-image expo-haptics expo-status-bar react-native-reanimated react-native-svg \
 react-native-gesture-handler react-native-safe-area-context @one-am/react-native-simple-image-slider
```

##### yarn

```shell
yarn add @shopify/flash-list expo-image expo-haptics expo-status-bar react-native-reanimated react-native-svg \
 react-native-gesture-handler react-native-safe-area-context @one-am/react-native-simple-image-slider
```

## Usage

```typescript jsx
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
      <Text style={{ color: '#ffffff' }}>Picture {index}</Text>
    )}
  />
</SimpleImageSliderThemeProvider>
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
