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

## API Reference

### Slider

Root component that wraps all slider functionality.

#### Props

| Prop                 | Type                        | Default      | Description                                               |
| -------------------- | --------------------------- | ------------ | --------------------------------------------------------- |
| `data`               | `SliderItem[]`              | **required** | Array of images with `key` and expo-image props           |
| `children`           | `ReactNode`                 | **required** | Child components (SliderContent, SliderPageCounter, etc.) |
| `imageAspectRatio`   | `number`                    | `4/3`        | Aspect ratio for images (width / height)                  |
| `initialIndex`       | `number`                    | `0`          | Initial image index to display                            |
| `style`              | `StyleProp<ViewStyle>`      | -            | Container style                                           |
| `onIndexChange`      | `(index: number) => void`   | -            | Callback when current index changes                       |
| `onItemPress`        | `(item, index) => void`     | -            | Callback when an image is pressed                         |
| `onFullScreenChange` | `(isOpen: boolean) => void` | -            | Callback when full-screen state changes                   |

---

### SliderContent

Renders the FlashList with images. Must be a child of `Slider`.

#### Props

| Prop                | Type                            | Default | Description                               |
| ------------------- | ------------------------------- | ------- | ----------------------------------------- |
| `enablePinchToZoom` | `boolean`                       | `false` | Enable pinch-to-zoom gestures             |
| `imageStyle`        | `StyleProp<ImageStyle>`         | -       | Style applied to all images               |
| `maxItems`          | `number`                        | -       | Limit number of images displayed          |
| `ref`               | `Ref<FlashListRef<SliderItem>>` | -       | Ref to FlashList for programmatic control |

---

### SliderPageCounter

Page indicator showing current/total (e.g., "1 / 10").

**Note:** To position `SliderPageCounter`, wrap it in `SliderCorner`.

#### Props

| Prop        | Type                                               | Default | Description              |
| ----------- | -------------------------------------------------- | ------- | ------------------------ |
| `style`     | `StyleProp<ViewStyle>`                             | -       | Container style override |
| `textStyle` | `StyleProp<TextStyle>`                             | -       | Text style override      |
| `render`    | `(current: number, total: number) => ReactElement` | -       | Custom render function   |

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
        render={(current, total) => (
            <View style={styles.customCounter}>
                <Text style={styles.counterText}>
                    Photo {current} of {total}
                </Text>
            </View>
        )}
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
        isFullScreenOpen,
        openFullScreen,
        closeFullScreen,
    } = useSlider();

    return (
        <Text>
            Viewing {currentIndex + 1} / {totalItems}
        </Text>
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
    data: SliderItem[];
    totalItems: number;
    currentIndex: number;
    setCurrentIndex: (index: number) => void;
    imageAspectRatio: number;
    containerWidth: number;
    containerHeight: number;
    listRef: RefObject<FlashListRef<SliderItem> | null>;
    scrollToIndex: (index: number, animated?: boolean) => void;
    isFullScreenOpen: boolean;
    openFullScreen: () => void;
    closeFullScreen: () => void;
    onItemPress?: (item: SliderItem, index: number) => void;
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
