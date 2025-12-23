# react-native-simple-image-slider

[![NPM Version](https://img.shields.io/npm/v/@one-am/react-native-simple-image-slider.svg?style=flat)](https://www.npmjs.com/package/@one-am/react-native-simple-image-slider)
[![NPM License](https://img.shields.io/npm/l/@one-am/react-native-simple-image-slider.svg?style=flat)](LICENSE)
[![NPM Downloads](https://img.shields.io/npm/dt/@one-am/react-native-simple-image-slider.svg?style=flat)](https://www.npmjs.com/package/@one-am/react-native-simple-image-slider)

A modern, compositional image slider for React Native built with [`@shopify/flash-list`](https://github.com/Shopify/flash-list) and [expo-image](https://docs.expo.dev/versions/latest/sdk/image/). Features a flexible component API inspired by shadcn/ui.

![Alt Text](docs/slider-demo.gif)

## Installation

#### Expo

##### npm

```shell
npx expo install @shopify/flash-list expo-image expo-haptics expo-status-bar react-native-reanimated react-native-svg \
 react-native-gesture-handler react-native-safe-area-context react-native-worklets @one-am/react-native-simple-image-slider
```

##### yarn

```shell
yarn dlx expo install @shopify/flash-list expo-image expo-haptics expo-status-bar react-native-reanimated react-native-svg \
 react-native-gesture-handler react-native-safe-area-context react-native-worklets @one-am/react-native-simple-image-slider
```

#### Non-Expo

##### npm

```shell
npm install @shopify/flash-list expo-image expo-haptics expo-status-bar react-native-reanimated react-native-svg \
 react-native-gesture-handler react-native-safe-area-context react-native-worklets @one-am/react-native-simple-image-slider
```

##### yarn

```shell
yarn add @shopify/flash-list expo-image expo-haptics expo-status-bar react-native-reanimated react-native-svg \
 react-native-gesture-handler react-native-safe-area-context react-native-worklets @one-am/react-native-simple-image-slider
```

## Quick Start

```tsx
import {
    Slider,
    SliderContent,
    SliderCorner,
    SliderPageCounter,
    SliderFullScreen,
    SliderCloseButton,
    SliderDescription,
} from '@one-am/react-native-simple-image-slider';

function Gallery() {
    const images = [
        { key: '1', source: require('./photo1.jpg') },
        { key: '2', source: require('./photo2.jpg') },
        { key: '3', source: require('./photo3.jpg') },
    ];

    return (
        <Slider data={images} imageAspectRatio={16 / 9}>
            <SliderContent />
            <SliderCorner position="bottom-left">
                <SliderPageCounter />
            </SliderCorner>
            <SliderFullScreen>
                <SliderContent enablePinchToZoom />
                <SliderCloseButton />
                <SliderDescription
                    render={(item, index) => (
                        <Text style={{ color: '#fff' }}>Photo {index + 1}</Text>
                    )}
                />
            </SliderFullScreen>
        </Slider>
    );
}
```

## Core Concepts

This library uses a **compositional API** where you build your slider by composing primitive components:

- **`Slider`** - Root component that provides context and manages state
- **`SliderContent`** - Renders the FlashList with images
- **`SliderPageCounter`** - Page indicator (e.g., "1 / 10")
- **`SliderCorner`** - Positioned container for custom overlays
- **`SliderFullScreen`** - Modal full-screen gallery
- **`SliderCloseButton`** - Close button for full-screen mode
- **`SliderDescription`** - Description overlay for full-screen
- **`SliderEmpty`** - Empty state component when no images are provided

## API Reference

### Slider

Root component that wraps all slider functionality.

#### Props

| Prop                 | Type                          | Default                       | Description                                                             |
| -------------------- | ----------------------------- | ----------------------------- | ----------------------------------------------------------------------- |
| `data`               | `SliderItem[]`                | **required**                  | Array of images with `key` and expo-image props                         |
| `children`           | `ReactNode`                   | **required**                  | Child components (SliderContent, SliderPageCounter, etc.)               |
| `imageAspectRatio`   | `number`                      | auto-detect (fallback: `4/3`) | Aspect ratio for images. Auto-detected from first image if not provided |
| `initialIndex`       | `number`                      | `0`                           | Initial image index to display                                          |
| `statusBarStyle`     | `'light' \| 'dark' \| 'auto'` | `'auto'`                      | Status bar style to restore when closing full screen                    |
| `style`              | `StyleProp<ViewStyle>`        | -                             | Container style                                                         |
| `onIndexChange`      | `(index: number) => void`     | -                             | Callback when current index changes                                     |
| `onItemPress`        | `(item, index) => void`       | -                             | Callback when an image is pressed                                       |
| `onFullScreenChange` | `(isOpen: boolean) => void`   | -                             | Callback when full-screen state changes                                 |

---

### SliderContent

Renders the FlashList with images. Must be a child of `Slider`.

#### Props

| Prop                         | Type                                                              | Default                            | Description                               |
| ---------------------------- | ----------------------------------------------------------------- | ---------------------------------- | ----------------------------------------- |
| `enablePinchToZoom`          | `boolean`                                                         | `false`                            | Enable pinch-to-zoom gestures             |
| `imageStyle`                 | `StyleProp<ImageStyle>`                                           | -                                  | Style applied to all images               |
| `maxItems`                   | `number`                                                          | -                                  | Limit number of images displayed          |
| `style`                      | `StyleProp<ViewStyle>`                                            | -                                  | Content container style                   |
| `imageAccessibilityLabel`    | `string \| ((imageNumber: number, totalItems: number) => string)` | `"Image X of Y"`                   | Accessibility label for images            |
| `pressableAccessibilityHint` | `string`                                                          | `"Double tap to open full screen"` | Accessibility hint for image press        |
| `ref`                        | `Ref<FlashListRef<SliderItem>>`                                   | -                                  | Ref to FlashList for programmatic control |

---

### SliderPageCounter

Page indicator showing current/total (e.g., "1 / 10").

**Note:** To position `SliderPageCounter`, wrap it in `SliderCorner`.

#### Props

| Prop                 | Type                                                     | Default          | Description                          |
| -------------------- | -------------------------------------------------------- | ---------------- | ------------------------------------ |
| `style`              | `StyleProp<ViewStyle>`                                   | -                | Container style override             |
| `textStyle`          | `StyleProp<TextStyle>`                                   | -                | Text style override                  |
| `accessibilityLabel` | `string \| ((current: number, total: number) => string)` | `"Image X of Y"` | Accessibility label for page counter |
| `backgroundColor`    | `string`                                                 | `#D3D3D3`        | Background color                     |
| `borderColor`        | `string`                                                 | `#000000`        | Border color                         |
| `textColor`          | `string`                                                 | `#000000`        | Text color                           |

---

### SliderCorner

Positioned container for custom components (badges, buttons, etc.).

#### Props

| Prop       | Type                                                           | Default      | Description                     |
| ---------- | -------------------------------------------------------------- | ------------ | ------------------------------- |
| `position` | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | **required** | Corner position                 |
| `children` | `ReactNode`                                                    | **required** | Content to display              |
| `style`    | `StyleProp<ViewStyle>`                                         | -            | Container style                 |
| `offset`   | `number`                                                       | `16`         | Distance from screen edges (px) |

---

### SliderFullScreen

Modal wrapper for full-screen gallery. Automatically syncs with parent `Slider` state.

#### Props

| Prop               | Type        | Default               | Description                                               |
| ------------------ | ----------- | --------------------- | --------------------------------------------------------- |
| `children`         | `ReactNode` | -                     | Child components (SliderContent, SliderCloseButton, etc.) |
| `imageAspectRatio` | `number`    | inherited from parent | Aspect ratio for full-screen images                       |

---

### SliderCloseButton

Close button for full-screen mode. Must be inside `SliderFullScreen`.

#### Props

| Prop       | Type                   | Default        | Description           |
| ---------- | ---------------------- | -------------- | --------------------- |
| `children` | `ReactNode`            | default X icon | Custom icon component |
| `style`    | `StyleProp<ViewStyle>` | -              | Button style          |

---

### SliderDescription

Description overlay for full-screen mode. Must be inside `SliderFullScreen`.

#### Props

| Prop     | Type                                             | Default      | Description                     |
| -------- | ------------------------------------------------ | ------------ | ------------------------------- |
| `render` | `(item: SliderItem, index: number) => ReactNode` | **required** | Render function for description |
| `style`  | `StyleProp<ViewStyle>`                           | -            | Container style                 |

---

### SliderEmpty

Empty state component displayed when no images are provided. Must be a child of `Slider`.

#### Props

| Prop       | Type                   | Default      | Description                   |
| ---------- | ---------------------- | ------------ | ----------------------------- |
| `children` | `ReactNode`            | **required** | Content to display when empty |
| `style`    | `StyleProp<ViewStyle>` | -            | Container style               |

#### Usage

```tsx
<Slider data={images}>
    <SliderContent />
    <SliderEmpty>
        <Text>No images available</Text>
    </SliderEmpty>
</Slider>
```

---

## Advanced Usage

### Custom Corner Components

```tsx
<Slider data={images}>
    <SliderContent />
    <SliderCorner position="top-right">
        <Badge text="NEW" />
    </SliderCorner>
    <SliderCorner position="bottom-right">
        <FavoriteButton />
    </SliderCorner>
</Slider>
```

### Custom Page Counter

```tsx
<SliderCorner position="top-right">
    <SliderPageCounter
        backgroundColor="#000000"
        borderColor="#FFFFFF"
        textColor="#FFFFFF"
        textStyle={styles.customText}
        accessibilityLabel={(current, total) => `Photo ${current} of ${total}`}
    />
</SliderCorner>
```

### Programmatic Scrolling

```tsx
import { useRef } from 'react';
import type { FlashListRef } from '@shopify/flash-list';
import type { SliderItem } from '@one-am/react-native-simple-image-slider';

function MyGallery() {
    const sliderRef = useRef<FlashListRef<SliderItem>>(null);

    const goToImage = (index: number) => {
        sliderRef.current?.scrollToIndex({ index, animated: true });
    };

    return (
        <Slider data={images}>
            <SliderContent ref={sliderRef} />
            <Button title="Go to Image 3" onPress={() => goToImage(2)} />
        </Slider>
    );
}
```

### Using Context with Custom Components

```tsx
import { useSlider } from '@one-am/react-native-simple-image-slider';

function NavigationButtons() {
    const { currentIndex, totalItems, scrollToIndex } = useSlider();

    return (
        <View style={styles.nav}>
            <Button
                disabled={currentIndex === 0}
                onPress={() => scrollToIndex(currentIndex - 1)}
                title="Previous"
            />
            <Button
                disabled={currentIndex === totalItems - 1}
                onPress={() => scrollToIndex(currentIndex + 1)}
                title="Next"
            />
        </View>
    );
}

// Usage
<Slider data={images}>
    <SliderContent />
    <NavigationButtons />
</Slider>;
```

### Minimal Gallery (No Full-Screen)

```tsx
<Slider data={images}>
    <SliderContent />
    <SliderCorner position="bottom-left">
        <SliderPageCounter />
    </SliderCorner>
</Slider>
```

### Full-Screen Only (No Inline Slider)

```tsx
function App() {
    return (
        <Slider data={images}>
            <Button
                onPress={() => {
                    /* trigger full-screen via context */
                }}
            >
                View Gallery
            </Button>
            <SliderFullScreen>
                <SliderContent enablePinchToZoom />
                <SliderCloseButton />
            </SliderFullScreen>
        </Slider>
    );
}
```

---

## Hooks

### useSlider

Access slider state and methods from any component inside `Slider`.

```tsx
import { useSlider } from '@one-am/react-native-simple-image-slider';

function MyComponent() {
    const {
        data,
        totalItems,
        currentIndex,
        setCurrentIndex,
        scrollToIndex,
        imageAspectRatio,
        isAspectRatioLoading,
        isFullScreenOpen,
        openFullScreen,
        closeFullScreen,
        hasFullScreen,
    } = useSlider();

    return (
        <View>
            <Text>
                Viewing {currentIndex + 1} / {totalItems}
            </Text>
            {hasFullScreen ? <Button title="Open Full Screen" onPress={openFullScreen} /> : null}
        </View>
    );
}
```

---

## Types

### SliderItem

```typescript
import type { ImageProps } from 'expo-image';

type SliderItem = ImageProps & {
    key: string; // Required unique identifier
};
```

### SliderContextValue

```typescript
type SliderContextValue = {
    // Data
    data: SliderItem[];
    totalItems: number;

    // Navigation
    currentIndex: number;
    setCurrentIndex: (index: number) => void;
    scrollToIndex: (index: number, animated?: boolean) => void;

    // Aspect Ratio
    imageAspectRatio: number;
    isAspectRatioLoading: boolean;

    // Full Screen
    isFullScreenOpen: boolean;
    openFullScreen: () => void;
    closeFullScreen: () => void;
    hasFullScreen: boolean;

    // Status Bar
    statusBarStyle: 'light' | 'dark' | 'auto';

    // Registration functions (for internal use)
    registerScrollFn: (fn: (index: number, animated?: boolean) => void) => () => void;
    registerFullScreen: () => () => void;

    // Event callbacks
    onItemPress?: (item: SliderItem, index: number) => void;
    onPinchStatusChange?: (status: PinchToZoomStatus) => void;
    onPinchDismiss?: () => void;
    // ... and more
};
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
