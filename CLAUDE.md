# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native image slider library (`@one-am/react-native-simple-image-slider`) built with a **compositional API** inspired by shadcn/ui. It uses FlashList for efficient scrolling and expo-image for optimized image rendering. The library provides primitive components that can be composed together to create custom galleries.

## Development Commands

### Build & Preparation

```bash
yarn prepare              # Build library with react-native-builder-bob (auto-runs on install)
yarn clean               # Delete lib/ directory
yarn typecheck           # Run TypeScript type checking (no emit)
```

### Code Quality

```bash
yarn lint                # Run ESLint on all source files
yarn test                # Run Jest tests
```

### Example App

```bash
yarn example start       # Start Expo dev server
yarn example android     # Run example on Android
yarn example ios         # Run example on iOS
yarn example web         # Run example in browser
```

### Release

```bash
yarn release             # Run release-it for versioning and publishing
yarn sync:deps           # Sync peer dependencies to dev dependencies
```

## Architecture

### Compositional API Pattern

The library uses a **flat exports** pattern (like shadcn/ui) where users compose primitive components:

```tsx
<Slider data={images}>
    <SliderContent />
    <SliderPageCounter position="bottom-left" />
    <SliderFullScreen>
        <SliderContent enablePinchToZoom />
        <SliderCloseButton />
    </SliderFullScreen>
</Slider>
```

### Component Hierarchy

The library exports 7 main primitives:

1. **Slider** (`src/primitives/slider.tsx`) - Root component with Context provider
    - Wraps children in `SliderProvider` for state sharing
    - Uses `GestureHandlerRootView` for gesture support
    - Provides state via React Context to all children

2. **SliderContent** (`src/primitives/slider-content.tsx`) - FlashList wrapper
    - Uses `@shopify/flash-list` for horizontal scrolling performance
    - Handles image rendering with `expo-image`
    - Supports ref forwarding to FlashList for imperative control (`.scrollToIndex()`)
    - Optionally wraps in `PinchToZoom` for gesture support

3. **SliderPageCounter** (`src/primitives/slider-page-counter.tsx`) - Page indicator
    - Positioned absolutely (top-left, top-right, bottom-left, bottom-right)
    - Reads `currentIndex` and `totalItems` from context
    - Supports custom render prop for full customization

4. **SliderCorner** (`src/primitives/slider-corner.tsx`) - Positioned container
    - Absolute positioning utility for custom overlays
    - Configurable offset from edges (default: 16px)

5. **SliderFullScreen** (`src/primitives/slider-full-screen.tsx`) - Modal full-screen gallery
    - Uses React Native Modal component
    - Creates **nested context** with its own index state
    - Includes fade in/out animations with Reanimated
    - Syncs index with parent on open/close

6. **SliderCloseButton** (`src/primitives/slider-close-button.tsx`) - Close button
    - Positioned in safe area (top-right by default)
    - Calls `closeFullScreen()` from context
    - Supports custom icon children

7. **SliderDescription** (`src/primitives/slider-description.tsx`) - Description container
    - Positioned at bottom with safe area insets
    - Receives current item and index via render prop

### Context Architecture

**File**: `src/context/slider-context.tsx`

The context provides shared state to all primitives:

```typescript
type SliderContextValue = {
    // Data
    data: SliderItem[];
    totalItems: number;

    // State
    currentIndex: number;
    setCurrentIndex: (index: number) => void;

    // Dimensions
    imageAspectRatio: number;
    containerWidth: number;
    containerHeight: number;

    // Refs
    listRef: RefObject<FlashListRef<SliderItem> | null>;
    scrollToIndex: (index: number, animated?: boolean) => void;

    // Full-screen
    isFullScreenOpen: boolean;
    openFullScreen: () => void;
    closeFullScreen: () => void;

    // Callbacks
    onItemPress?: (item: SliderItem, index: number) => void;
    registerOnItemPress: (handler) => void;

    // Layout
    handleLayout: (event: LayoutChangeEvent) => void;
};
```

### Nested Context for Full-Screen

`SliderFullScreen` creates a **nested SliderProvider** that:

- Inherits `data` from parent context
- Has its own `currentIndex` state (synced on open/close)
- Has its own `listRef` for the full-screen FlashList
- Overrides `closeFullScreen` to sync index back to parent

This allows full-screen gallery to scroll independently while maintaining sync with the inline slider.

### Key Design Patterns

**Context Hook Pattern**: All primitives use `useSlider()` to access shared state:

```typescript
function SliderPageCounter() {
    const { currentIndex, totalItems } = useSlider();
    // ...
}
```

**Ref Forwarding**: All components use `forwardRef` to expose FlashList refs for programmatic scrolling:

```typescript
sliderRef.current?.scrollToIndex({ index: 2, animated: true });
```

**Composition over Props**: Instead of 30+ props on a single component, functionality is distributed across composable primitives.

## Build System

**Tool**: `react-native-builder-bob` v0.35.2

**Outputs** (in `lib/` directory):

- `lib/commonjs/` - CommonJS modules
- `lib/module/` - ES modules
- `lib/typescript/` - TypeScript type definitions

**TypeScript Configs**:

- `tsconfig.json` - Base config with strict mode enabled
- `tsconfig.build.json` - Extends base, excludes example app

**Key TypeScript Settings**:

- Strict mode enabled with `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`
- Target: ESNext
- JSX: react

## Testing

**Framework**: Jest with `react-native` preset

**Current Status**: Tests are not yet implemented (placeholder exists in `src/__tests__/index.test.tsx`)

**To Run Tests**:

```bash
yarn test
```

When writing tests:

- Use `@testing-library/react-native` for component testing
- Mock native modules (gesture-handler, reanimated, expo-image)
- Test files go in `src/__tests__/`

## Code Quality

**Pre-commit Hooks** (via lefthook):

- Runs `yarn lint` on JS/TS changes
- Runs `yarn typecheck` on type definition changes
- Validates commit messages with commitlint (conventional commits)

**Commit Message Format**: Uses conventional commits (Angular preset)

```
feat: add new feature
fix: bug fix
docs: documentation changes
chore: maintenance tasks
```

**ESLint Rules**:

- Max complexity: 10 (warning)
- `@typescript-eslint/no-shadow`: error
- `react-hooks/exhaustive-deps`: error (level 2)

**Prettier**: 4-space tabs, single quotes, 100 char line width, no semicolons

## Important Dependencies

All these are peer dependencies and must be installed:

- `@shopify/flash-list` <2.0.0 - High-performance list component
- `expo-image` - Optimized image rendering
- `expo-haptics` - Haptic feedback
- `react-native-gesture-handler` - Gesture detection
- `react-native-reanimated` - Smooth animations
- `react-native-safe-area-context` - Safe area support
- `react-native-svg` - SVG support for icons

## Project Structure

```
src/
├── index.ts                    # Main entry point (exports all primitives)
├── primitives/
│   ├── slider.tsx               # Root component with Context
│   ├── slider-content.tsx        # FlashList wrapper
│   ├── slider-page-counter.tsx    # Page indicator
│   ├── slider-corner.tsx         # Positioned container
│   ├── slider-full-screen.tsx     # Modal full-screen
│   ├── slider-close-button.tsx    # Close button
│   ├── slider-description.tsx    # Description overlay
│   └── index.ts                 # Barrel export
├── context/
│   └── slider-context.tsx        # Context provider + useSlider hook
├── hooks/
│   └── use-slider-state.ts        # Internal state management
├── @types/
│   ├── context.ts               # Context and SliderItem types
│   ├── icons.ts                 # IconsProps (extends SvgProps)
│   └── pinch-to-zoom.ts         # PinchToZoomStatus type
├── utils/
│   └── clamp.ts                 # Worklet-compatible value clamping
├── icons/
│   └── icon-x.tsx                # Close button icon
└── internal/
    └── pinch-to-zoom.tsx          # Internal gesture wrapper

example/                         # Expo example app
├── src/App.tsx                  # Demo implementation with new API
└── assets/photos/               # Sample images

lib/                             # Built output (generated, git-ignored)
```

## iOS Scrolling Quirk

SliderContent includes a platform-specific workaround for iOS scroll behavior:

```typescript
// iOS has a bug where snapToInterval causes scroll overshoot
snapToInterval={Platform.OS === 'ios' ? imageWidth - 1 : imageWidth}
```

Keep this in mind when modifying scroll behavior.

## Release Process

Releases are managed with `release-it`:

1. Commits follow conventional format (feat, fix, docs, etc.)
2. Run `yarn release` to bump version and publish
3. Creates git tag: `v${version}`
4. Publishes to npm: `@one-am/react-native-simple-image-slider`
5. Creates GitLab release

Current version: 0.17.0+ (compositional API)

## Breaking Changes (v1.0.0)

### Removed Components

- `SimpleImageSlider` - replaced with compositional API
- `BaseSimpleImageSlider` - replaced with `Slider` + `SliderContent`
- `FullScreenImageSlider` - replaced with `SliderFullScreen`
- `SimpleImageSliderThemeProvider` - theming now via props only
- `PageCounter` - replaced with `SliderPageCounter`

### Renamed Types

- `SimpleImageSliderItem` → `SliderItem`

### New Exports

- `Slider`, `SliderContent`, `SliderPageCounter`, `SliderCorner`, `SliderFullScreen`, `SliderCloseButton`, `SliderDescription`
- `useSlider` hook
- `SliderContextValue` type

### Migration Example

**Before (v0.x)**:

```tsx
<SimpleImageSliderThemeProvider>
    <SimpleImageSlider
        data={images}
        fullScreenEnabled={true}
        pageCounterPosition="bottom-left"
        TopRightComponent={<Badge />}
    />
</SimpleImageSliderThemeProvider>
```

**After (v1.0)**:

```tsx
<Slider data={images}>
    <SliderContent />
    <SliderPageCounter position="bottom-left" />
    <SliderCorner position="top-right">
        <Badge />
    </SliderCorner>
    <SliderFullScreen>
        <SliderContent enablePinchToZoom />
        <SliderCloseButton />
    </SliderFullScreen>
</Slider>
```

## Workspace Setup

This is a Yarn 3 workspace with:

- Root: Library code
- `example/`: Expo app for testing

Use `yarn example <command>` to run commands in the example workspace.

- tutti gli export alla fine, usare sempre export type per i tipi. niente export di default.
