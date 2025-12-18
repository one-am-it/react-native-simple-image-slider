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

## Components

This library exports three main slider components:

- **SimpleImageSlider** - Standard slider with optional full-screen mode
- **BaseSimpleImageSlider** - Core slider component (use for custom implementations)
- **FullScreenImageSlider** - Standalone modal full-screen gallery

Additional components:

- **SimpleImageSliderThemeProvider** - Theme provider for color customization
- **PinchToZoom** - Gesture wrapper for zoom/pan functionality
- **PageCounter** - Page indicator component

## API Reference

### SimpleImageSlider

Main component with optional full-screen gallery on image press.

#### Props

| Prop                          | Type                                                           | Default                    | Description                                                                               |
| ----------------------------- | -------------------------------------------------------------- | -------------------------- | ----------------------------------------------------------------------------------------- |
| `data`                        | `SimpleImageSliderItem[]`                                      | **required**               | Array of images to display. Each item must have a `key` and image props from expo-image.  |
| `fullScreenEnabled`           | `boolean`                                                      | `false`                    | Enable full-screen mode on image press. **Note:** When enabled, `onItemPress` is ignored. |
| `imageAspectRatio`            | `number`                                                       | `4/3`                      | Aspect ratio for images (width / height).                                                 |
| `fullScreenImageAspectRatio`  | `number`                                                       | same as `imageAspectRatio` | Separate aspect ratio for full-screen mode.                                               |
| `imageWidth`                  | `number`                                                       | `'100%'`                   | Width of images. Defaults to full container width.                                        |
| `imageHeight`                 | `number`                                                       | `'100%'`                   | Height of images. Defaults to full container height.                                      |
| `onItemPress`                 | `(item, index) => void`                                        | -                          | Callback when image is pressed. Ignored if `fullScreenEnabled` is true.                   |
| `onViewableItemChange`        | `(index) => void`                                              | -                          | Callback when visible item changes during scrolling.                                      |
| `indexOverride`               | `number`                                                       | -                          | Initial index to display.                                                                 |
| `showPageCounter`             | `boolean`                                                      | `true`                     | Show/hide page counter (e.g., "1 / 10").                                                  |
| `pageCounterPosition`         | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'bottom-right'`           | Position of page counter.                                                                 |
| `renderFullScreenDescription` | `(item, index) => ReactNode`                                   | -                          | Render description below full-screen images.                                              |
| `FullScreenCloseButtonIcon`   | `RenderProp`                                                   | default X icon             | Custom close button for full-screen mode.                                                 |
| `enablePinchToZoom`           | `boolean`                                                      | `false`                    | Enable pinch-to-zoom gestures.                                                            |
| `maxItems`                    | `number`                                                       | -                          | Limit number of images displayed.                                                         |

**Corner Components** (overlays positioned absolutely):

- `TopLeftComponent`, `TopRightComponent`, `BottomLeftComponent`, `BottomRightComponent`: `RenderProp` - Custom components for each corner.

**Page Counter Customization**:

- `PageCounterComponent`: `React.FunctionComponent<PageCounterProps>` - Custom page counter component.
- `renderPageCounter`: `(currentPage, totalPages) => ReactElement` - Custom render function (disables automatic positioning).
- `pageCounterStyle`, `pageCounterTextStyle`: Style overrides for default page counter.

---

### BaseSimpleImageSlider

Core slider component used internally by SimpleImageSlider and FullScreenImageSlider.

#### Props

Same as `SimpleImageSlider` except:

- No `fullScreenEnabled`, `renderFullScreenDescription`, or `FullScreenCloseButtonIcon` props.
- Includes `ref` forwarding to FlashList for programmatic scrolling.

#### Ref Methods

```typescript
const sliderRef = useRef<FlashListRef<SimpleImageSliderItem>>(null);

// Scroll to specific index
sliderRef.current?.scrollToIndex({ index: 2, animated: true });
```

---

### FullScreenImageSlider

Modal full-screen gallery with pinch-to-zoom always enabled.

#### Props

| Prop                | Type                         | Default        | Description                                                            |
| ------------------- | ---------------------------- | -------------- | ---------------------------------------------------------------------- |
| `data`              | `SimpleImageSliderItem[]`    | **required**   | Array of images to display.                                            |
| `open`              | `boolean`                    | -              | Controls modal visibility.                                             |
| `onRequestClose`    | `() => void`                 | -              | Callback when close is requested (back button, gesture, close button). |
| `renderDescription` | `(item, index) => ReactNode` | -              | Render description below images.                                       |
| `CloseButtonIcon`   | `RenderProp`                 | default X icon | Custom close button icon.                                              |
| `onFadeOut`         | `() => void`                 | -              | Callback when fade-out animation begins.                               |
| `imageAspectRatio`  | `number`                     | `4/3`          | Aspect ratio for images.                                               |

Plus all props from `BaseSimpleImageSlider` except `imageWidth` (auto-set to screen width).

**iOS Scrolling Note:** On iOS, `snapToInterval` is set to `imageWidth - 1` to prevent scroll overshoot (known platform quirk).

---

### PinchToZoom

Gesture wrapper for pinch-to-zoom, pan, and double-tap functionality.

#### Props

| Prop               | Type                                  | Default | Description                                  |
| ------------------ | ------------------------------------- | ------- | -------------------------------------------- |
| `minimumZoomScale` | `number`                              | `1`     | Minimum zoom scale.                          |
| `maximumZoomScale` | `number`                              | `8`     | Maximum zoom scale.                          |
| `onScaleChange`    | `() => void`                          | -       | Callback when zoom changes from minimum.     |
| `onScaleReset`     | `() => void`                          | -       | Callback when zoom returns to minimum.       |
| `onStatusChange`   | `(status: PinchToZoomStatus) => void` | -       | Callback with current scale and translation. |
| `onDismiss`        | `() => void`                          | -       | Callback when dismiss gesture is detected.   |

---

### SimpleImageSliderThemeProvider

Context provider for theming colors.

#### Props

| Prop        | Type                              | Description                                      |
| ----------- | --------------------------------- | ------------------------------------------------ |
| `overrides` | `Partial<SimpleImageSliderTheme>` | Theme overrides (see Theme Customization below). |
| `children`  | `ReactNode`                       | Child components.                                |

---

### PageCounter

Simple page indicator showing "current / total".

#### Props

| Prop          | Type                   | Default      | Description                   |
| ------------- | ---------------------- | ------------ | ----------------------------- |
| `currentPage` | `number`               | **required** | Current page index (0-based). |
| `totalPages`  | `number`               | **required** | Total number of pages.        |
| `style`       | `StyleProp<ViewStyle>` | -            | Container style override.     |
| `textStyle`   | `StyleProp<TextStyle>` | -            | Text style override.          |

---

## Theme Customization

Use `SimpleImageSliderThemeProvider` to customize colors:

```typescript jsx
<SimpleImageSliderThemeProvider
  overrides={{
    colors: {
      pageCounterBackground: '#000000',
      pageCounterBorder: '#FFFFFF',
      fullScreenCloseButton: '#FF0000',
      descriptionContainerBorder: '#CCCCCC',
    },
  }}
>
  <SimpleImageSlider {...props} />
</SimpleImageSliderThemeProvider>
```

### Available Theme Colors

| Color                        | Default     | Used By                            |
| ---------------------------- | ----------- | ---------------------------------- |
| `pageCounterBackground`      | `'#D3D3D3'` | Page counter background            |
| `pageCounterBorder`          | `'#000000'` | Page counter border                |
| `fullScreenCloseButton`      | `'#FFFFFF'` | Full-screen close button icon      |
| `descriptionContainerBorder` | `'#FFFFFF'` | Full-screen description top border |

### Using the Theme Hook

```typescript
import { useSimpleImageSliderTheme } from '@one-am/react-native-simple-image-slider';

const MyComponent = () => {
  const theme = useSimpleImageSliderTheme();
  return <View style={{ backgroundColor: theme.colors.pageCounterBackground }} />;
};
```

---

## Advanced Usage

### Programmatic Scrolling with Refs

```typescript
import { useRef } from 'react';
import type { FlashListRef } from '@shopify/flash-list';
import type { SimpleImageSliderItem } from '@one-am/react-native-simple-image-slider';

const MyComponent = () => {
  const sliderRef = useRef<FlashListRef<SimpleImageSliderItem>>(null);

  const scrollToThirdImage = () => {
    sliderRef.current?.scrollToIndex({ index: 2, animated: true });
  };

  return (
    <>
      <Button title="Go to Image 3" onPress={scrollToThirdImage} />
      <SimpleImageSlider ref={sliderRef} data={photos} />
    </>
  );
};
```

---

### Custom Corner Components

```typescript
<SimpleImageSlider
  data={photos}
  TopRightComponent={<Badge text="NEW" />}
  BottomLeftComponent={() => <WatermarkLogo />}
/>
```

Corner components support:

- React elements: `<MyComponent />`
- Component types: `MyComponent` (rendered with no props)
- `undefined`/`null`: No component

---

### Custom Page Counter

#### Using `PageCounterComponent`

```typescript
import { PageCounter } from '@one-am/react-native-simple-image-slider';
import type { PageCounterProps } from '@one-am/react-native-simple-image-slider';

const CustomPageCounter = ({ currentPage, totalPages }: PageCounterProps) => (
  <View style={styles.customCounter}>
    <Text>{currentPage + 1} of {totalPages}</Text>
  </View>
);

<SimpleImageSlider
  data={photos}
  PageCounterComponent={CustomPageCounter}
/>
```

#### Using `renderPageCounter`

**Note:** When using `renderPageCounter`, you must handle positioning manually as `pageCounterPosition` is ignored.

```typescript
<SimpleImageSlider
  data={photos}
  renderPageCounter={(current, total) => (
    <View style={{ position: 'absolute', top: 20, right: 20 }}>
      <Text>{current + 1}/{total}</Text>
    </View>
  )}
/>
```

---

### Standalone Components

#### Using BaseSimpleImageSlider

For custom implementations without full-screen functionality:

```typescript
<BaseSimpleImageSlider
  data={photos}
  imageAspectRatio={16 / 9}
  onItemPress={(item, index) => console.log('Pressed:', index)}
  TopRightComponent={<Badge />}
/>
```

#### Using FullScreenImageSlider

For custom full-screen gallery implementations:

```typescript
const [isOpen, setIsOpen] = useState(false);
const [currentIndex, setCurrentIndex] = useState(0);

<>
  <Button title="Open Gallery" onPress={() => setIsOpen(true)} />
  <FullScreenImageSlider
    open={isOpen}
    data={photos}
    indexOverride={currentIndex}
    onRequestClose={() => setIsOpen(false)}
    onViewableItemChange={setCurrentIndex}
    renderDescription={(item, index) => (
      <Text style={{ color: '#fff' }}>Photo {index + 1}</Text>
    )}
  />
</>
```

---

## Types

### SimpleImageSliderItem

```typescript
import type { ImageProps } from 'expo-image';

type SimpleImageSliderItem = ImageProps & {
    key: string; // Required unique identifier
};
```

### RenderProp

```typescript
type RenderProp = React.ComponentType<unknown> | React.ReactElement | undefined | null;
```

### PinchToZoomStatus

```typescript
type PinchToZoomStatus = {
    scale: number;
    translation: { x: number; y: number };
};
```

---

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
