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
    SliderProvider,
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
        <SliderProvider data={images} imageAspectRatio={16 / 9}>
            <Slider>
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
        </SliderProvider>
    );
}
```

## Core Concepts

This library uses a **compositional API** where you build your slider by composing primitive components:

- **`SliderProvider`** - Root context provider that manages state (required wrapper)
- **`Slider`** - Container component with gesture handling
- **`SliderContent`** - Renders the FlashList with images
- **`SliderPageCounter`** - Page indicator (e.g., "1 / 10")
- **`SliderCorner`** - Positioned container for custom overlays
- **`SliderFullScreen`** - Modal full-screen gallery
- **`SliderCloseButton`** - Close button for full-screen mode
- **`SliderDescription`** - Description overlay for full-screen
- **`SliderEmpty`** - Empty state component when no images are provided

## API Reference

### SliderProvider

Root context provider that manages state. **Required wrapper** for all slider functionality.

#### Props

| Prop                 | Type                          | Default                       | Description                                                             |
| -------------------- | ----------------------------- | ----------------------------- | ----------------------------------------------------------------------- |
| `data`               | `SliderItem[]`                | **required**                  | Array of images with `key` and expo-image props                         |
| `children`           | `ReactNode`                   | **required**                  | Child components (Slider, custom components with useSlider, etc.)       |
| `imageAspectRatio`   | `number`                      | auto-detect (fallback: `4/3`) | Aspect ratio for images. Auto-detected from first image if not provided |
| `initialIndex`       | `number`                      | `0`                           | Initial image index to display                                          |
| `statusBarStyle`     | `'light' \| 'dark' \| 'auto'` | `'auto'`                      | Status bar style to restore when closing full screen                    |
| `onIndexChange`      | `(index: number) => void`     | -                             | Callback when current index changes                                     |
| `onItemPress`        | `(item, index) => void`       | -                             | Callback when an image is pressed                                       |
| `onFullScreenChange` | `(isOpen: boolean) => void`   | -                             | Callback when full-screen state changes                                 |

---

### Slider

Container component with gesture handling. Must be inside `SliderProvider`.

#### Props

| Prop       | Type                   | Default      | Description                                               |
| ---------- | ---------------------- | ------------ | --------------------------------------------------------- |
| `children` | `ReactNode`            | **required** | Child components (SliderContent, SliderPageCounter, etc.) |
| `style`    | `StyleProp<ViewStyle>` | -            | Container style                                           |

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
<SliderProvider data={images}>
    <Slider>
        <SliderContent />
        <SliderCorner position="top-right">
            <Badge text="NEW" />
        </SliderCorner>
        <SliderCorner position="bottom-right">
            <FavoriteButton />
        </SliderCorner>
    </Slider>
</SliderProvider>
```

### Custom Page Counter

```tsx
<SliderProvider data={images}>
    <Slider>
        <SliderContent />
        <SliderCorner position="top-right">
            <SliderPageCounter
                backgroundColor="#000000"
                borderColor="#FFFFFF"
                textColor="#FFFFFF"
                textStyle={styles.customText}
                accessibilityLabel={(current, total) => `Photo ${current} of ${total}`}
            />
        </SliderCorner>
    </Slider>
</SliderProvider>
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
        <SliderProvider data={images}>
            <Slider>
                <SliderContent ref={sliderRef} />
                <Button title="Go to Image 3" onPress={() => goToImage(2)} />
            </Slider>
        </SliderProvider>
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
<SliderProvider data={images}>
    <Slider>
        <SliderContent />
        <NavigationButtons />
    </Slider>
</SliderProvider>;
```

### Minimal Gallery (No Full-Screen)

```tsx
<SliderProvider data={images}>
    <Slider>
        <SliderContent />
        <SliderCorner position="bottom-left">
            <SliderPageCounter />
        </SliderCorner>
    </Slider>
</SliderProvider>
```

### External Control with Custom Components

Use `useSlider()` from any component inside `SliderProvider` to control the slider externally:

```tsx
import {
    SliderProvider,
    Slider,
    SliderFullScreen,
    SliderContent,
    useSlider,
} from '@one-am/react-native-simple-image-slider';

function ImageGrid() {
    const { openFullScreen, scrollToIndex } = useSlider();

    return (
        <View style={styles.grid}>
            {images.map((image, index) => (
                <Pressable
                    key={image.key}
                    onPress={() => {
                        scrollToIndex(index);
                        openFullScreen();
                    }}
                >
                    <Image source={image.source} style={styles.thumbnail} />
                </Pressable>
            ))}
        </View>
    );
}

function App() {
    return (
        <SliderProvider data={images} imageAspectRatio={16 / 9}>
            <ImageGrid />
            <Slider>
                <SliderFullScreen>
                    <SliderContent enablePinchToZoom />
                    <SliderCloseButton />
                </SliderFullScreen>
            </Slider>
        </SliderProvider>
    );
}
```

---

## Migration from v0.x to v1.0

Version 1.0 introduces a **compositional API** inspired by shadcn/ui, replacing the monolithic component approach. This provides greater flexibility and reduces bundle size by only including the components you use.

### Dependency Updates

First, update your dependencies to meet the new minimum versions:

#### Expo

```shell
npx expo install @shopify/flash-list expo-image expo-haptics expo-status-bar react-native-reanimated react-native-svg \
 react-native-gesture-handler react-native-safe-area-context react-native-worklets @one-am/react-native-simple-image-slider
```

#### Non-Expo

```shell
npm install @shopify/flash-list@latest react-native-reanimated@latest react@latest react-native-worklets \
 @one-am/react-native-simple-image-slider@latest
```

**Key dependency changes:**

- `react-native-worklets` - **NEW** peer dependency (required)
- `@shopify/flash-list` - now requires `>=2` (was `<2.0.0`)
- `react` - now requires `>=19`
- `react-native-reanimated` - now requires `>=4`

### Breaking Changes

#### Removed Components

| v0.x Component                   | v1.0 Replacement                             |
| -------------------------------- | -------------------------------------------- |
| `SimpleImageSlider`              | `Slider` + `SliderContent` + children        |
| `SimpleImageSliderThemeProvider` | Removed (use component props for styling)    |
| `BaseListImageSlider`            | `Slider` + `SliderContent`                   |
| `FullScreenImageSlider`          | `SliderFullScreen`                           |
| `PageCounter`                    | `SliderPageCounter` (wrap in `SliderCorner`) |
| `PinchToZoom` (exported)         | `enablePinchToZoom` prop on `SliderContent`  |
| `useSimpleImageSliderTheme` hook | Removed                                      |

#### Renamed Types

| v0.x Type               | v1.0 Type    |
| ----------------------- | ------------ |
| `SimpleImageSliderItem` | `SliderItem` |

#### New Components

- `Slider` - Root context provider
- `SliderContent` - FlashList wrapper for rendering images
- `SliderPageCounter` - Page counter component
- `SliderCorner` - Absolute positioning utility
- `SliderFullScreen` - Full-screen modal
- `SliderCloseButton` - Close button for full-screen
- `SliderDescription` - Description overlay for full-screen
- `SliderEmpty` - Empty state component

#### New Hook

- `useSlider` - Access slider context from custom components

### Code Migration Examples

#### Basic Slider with Full-Screen

**Before (v0.x):**

```tsx
import {
    SimpleImageSliderThemeProvider,
    SimpleImageSlider,
} from '@one-am/react-native-simple-image-slider';

<SimpleImageSliderThemeProvider>
    <SimpleImageSlider
        data={photos.map((photo, index) => ({
            source: photo,
            key: index.toString(),
        }))}
        imageWidth={width}
        imageAspectRatio={16 / 9}
        fullScreenEnabled={true}
        pageCounterPosition="bottom-left"
        renderFullScreenDescription={(_, index) => (
            <Text style={{ color: '#ffffff' }}>Picture {index}</Text>
        )}
        FullScreenCloseButtonIcon={<CustomIcon />}
    />
</SimpleImageSliderThemeProvider>;
```

**After (v1.0):**

```tsx
import {
    SliderProvider,
    Slider,
    SliderContent,
    SliderCorner,
    SliderPageCounter,
    SliderFullScreen,
    SliderCloseButton,
    SliderDescription,
} from '@one-am/react-native-simple-image-slider';

<SliderProvider
    data={photos.map((photo, index) => ({
        source: photo,
        key: index.toString(),
    }))}
    imageAspectRatio={16 / 9}
>
    <Slider>
        <SliderContent />
        <SliderCorner position="bottom-left">
            <SliderPageCounter />
        </SliderCorner>
        <SliderFullScreen>
            <SliderContent enablePinchToZoom />
            <SliderCloseButton>
                <CustomIcon />
            </SliderCloseButton>
            <SliderDescription
                render={(_, index) => <Text style={{ color: '#ffffff' }}>Picture {index}</Text>}
            />
        </SliderFullScreen>
    </Slider>
</SliderProvider>;
```

#### Custom Overlays (Badges, Buttons)

**Before (v0.x):**

```tsx
<SimpleImageSlider
    data={photos}
    TopRightComponent={<Badge text="NEW" />}
    BottomRightComponent={<FavoriteButton />}
/>
```

**After (v1.0):**

```tsx
<SliderProvider data={photos}>
    <Slider>
        <SliderContent />
        <SliderCorner position="top-right">
            <Badge text="NEW" />
        </SliderCorner>
        <SliderCorner position="bottom-right">
            <FavoriteButton />
        </SliderCorner>
    </Slider>
</SliderProvider>
```

#### Accessing Slider State

**Before (v0.x):**

Not directly supported. Required ref access and manual state management.

**After (v1.0):**

```tsx
import { useSlider } from '@one-am/react-native-simple-image-slider';

function NavigationButtons() {
    const { currentIndex, totalItems, scrollToIndex } = useSlider();

    return (
        <View>
            <Button
                disabled={currentIndex === 0}
                onPress={() => scrollToIndex(currentIndex - 1)}
                title="Prev"
            />
            <Button
                disabled={currentIndex === totalItems - 1}
                onPress={() => scrollToIndex(currentIndex + 1)}
                title="Next"
            />
        </View>
    );
}

<SliderProvider data={photos}>
    <Slider>
        <SliderContent />
        <NavigationButtons />
    </Slider>
</SliderProvider>;
```

### Removed Props

The following props from `SimpleImageSlider` are removed or replaced:

| v0.x Prop                     | v1.0 Alternative                                         |
| ----------------------------- | -------------------------------------------------------- |
| `imageWidth`                  | Automatically calculated (removed)                       |
| `data`                        | Now on `<SliderProvider>` instead of `<Slider>`          |
| `imageAspectRatio`            | Now on `<SliderProvider>`                                |
| `initialIndex`                | Now on `<SliderProvider>`                                |
| `statusBarStyle`              | Now on `<SliderProvider>`                                |
| `onIndexChange`               | Now on `<SliderProvider>`                                |
| `onItemPress`                 | Now on `<SliderProvider>`                                |
| `onFullScreenChange`          | Now on `<SliderProvider>`                                |
| `fullScreenEnabled`           | Use `<SliderFullScreen>` as a child                      |
| `pageCounterPosition`         | Use `<SliderCorner position="..."><SliderPageCounter />` |
| `renderFullScreenDescription` | Use `<SliderDescription render={...} />`                 |
| `FullScreenCloseButtonIcon`   | Use `<SliderCloseButton>` with custom children           |
| `TopLeftComponent`            | Use `<SliderCorner position="top-left">`                 |
| `TopRightComponent`           | Use `<SliderCorner position="top-right">`                |
| `BottomLeftComponent`         | Use `<SliderCorner position="bottom-left">`              |
| `BottomRightComponent`        | Use `<SliderCorner position="bottom-right">`             |
| `showPageCounter`             | Don't render `<SliderPageCounter>` component             |
| `fullScreenImageAspectRatio`  | Use `imageAspectRatio` prop on `<SliderFullScreen>`      |

### Why This Change?

The new compositional API provides:

- **Flexibility** - Compose only the features you need
- **Smaller bundle size** - Tree-shaking removes unused components
- **Better TypeScript support** - Explicit component props instead of a large union
- **Easier customization** - Override individual components without prop drilling
- **Familiar patterns** - Similar to shadcn/ui and other modern component libraries

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

### SliderPublicState

The `useSlider` hook returns `SliderPublicState`, which exposes only the public API:

```typescript
type SliderPublicState = {
    // Data
    data: SliderItem[];
    totalItems: number;

    // Navigation
    currentIndex: number;
    scrollToIndex: (index: number, animated?: boolean) => void;

    // Aspect Ratio
    imageAspectRatio: number;
    isAspectRatioLoading: boolean;

    // Full Screen
    isFullScreenOpen: boolean;
    openFullScreen: () => void;
    closeFullScreen: () => void;
    hasFullScreen: boolean;
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
