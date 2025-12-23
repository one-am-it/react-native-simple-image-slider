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
<SliderProvider data={images} imageAspectRatio={16 / 9}>
    <Slider>
        <SliderContent />
        <SliderCorner position="bottom-left">
            <SliderPageCounter />
        </SliderCorner>
        <SliderFullScreen>
            <SliderContent enablePinchToZoom />
            <SliderCloseButton />
        </SliderFullScreen>
    </Slider>
</SliderProvider>
```

### Component Hierarchy

The library exports 9 main primitives:

1. **SliderProvider** (`src/primitives/slider-provider.tsx`) - Root context provider
    - **Required wrapper** for all slider functionality
    - Manages state via `SliderContextProvider` from context
    - Accepts data, callbacks, and configuration props
    - Makes `useSlider()` hook available to all children

2. **Slider** (`src/primitives/slider.tsx`) - Container component with gesture handling
    - Uses `GestureHandlerRootView` for gesture support
    - Must be inside `SliderProvider`
    - Only accepts `children` and `style` props

3. **SliderContent** (`src/primitives/slider-content.tsx`) - FlashList wrapper
    - Uses `@shopify/flash-list` for horizontal scrolling performance
    - Handles image rendering with `expo-image`
    - Supports ref forwarding to FlashList for imperative control (`.scrollToIndex()`)
    - Optionally wraps in `PinchToZoom` for gesture support

4. **SliderPageCounter** (`src/primitives/slider-page-counter.tsx`) - Page indicator
    - Displays current page and total count
    - Reads `currentIndex` and `totalItems` from context
    - Supports custom render prop for full customization
    - Must be wrapped in `SliderCorner` for positioning

5. **SliderCorner** (`src/primitives/slider-corner.tsx`) - Positioned container
    - Absolute positioning utility for custom overlays
    - Configurable offset from edges (default: 16px)

6. **SliderFullScreen** (`src/primitives/slider-full-screen.tsx`) - Modal full-screen gallery
    - Uses React Native Modal component
    - Creates **nested context** with its own index state
    - Includes fade in/out animations with Reanimated
    - Syncs index with parent on open/close

7. **SliderCloseButton** (`src/primitives/slider-close-button.tsx`) - Close button
    - Positioned in safe area (top-right by default)
    - Calls `closeFullScreen()` from context
    - Supports custom icon children

8. **SliderDescription** (`src/primitives/slider-description.tsx`) - Description container
    - Positioned at bottom with safe area insets
    - Receives current item and index via render prop

9. **SliderEmpty** (`src/primitives/slider-empty.tsx`) - Empty state component
    - Displayed when no images are provided
    - Uses same aspect ratio as configured in SliderProvider

### Context Architecture

**Files**:

- `src/primitives/slider-provider.tsx` - Public SliderProvider component
- `src/context/slider-context.tsx` - Internal SliderContextProvider and hooks

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

**Mandatory Provider Pattern**: `SliderProvider` is required to wrap all slider functionality. This enables `useSlider()` hook access from any component in the tree, not just slider children.

**Context Hook Pattern**: All primitives use `useSlider()` to access shared state:

```typescript
function SliderPageCounter() {
    const { currentIndex, totalItems } = useSlider();
    // ...
}
```

**External Control**: Custom components outside `Slider` can control it via `useSlider()`:

```typescript
<SliderProvider data={images}>
    <MyCustomGrid /> {/* can use useSlider() to openFullScreen() */}
    <Slider>
        <SliderFullScreen>...</SliderFullScreen>
    </Slider>
</SliderProvider>
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

- Strict mode enabled with:
    - `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`
    - `noUncheckedIndexedAccess`: true (stricter array/object access)
    - `noFallthroughCasesInSwitch`: true
- `verbatimModuleSyntax`: true (explicit type imports)
- Module resolution: bundler
- Target: ESNext
- JSX: react
- Platform-specific module suffixes: `.ios`, `.android`, `.native`

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

- Runs `yarn lint` on staged JS/TS/JSON files
- Runs prettier check on staged files (JS/TS/JSON/YML/MD)
- Runs `yarn typecheck` on staged JS/TS/JSON files
- Validates commit messages with commitlint (conventional commits)

**Commit Message Format**: Uses conventional commits (Angular preset)

```
feat: add new feature
fix: bug fix
docs: documentation changes
chore: maintenance tasks
```

**ESLint Configuration**:

Uses ESLint flat config (eslint.config.js) with:

- Expo config preset (`eslint-config-expo/flat`)
- TypeScript parser with project service
- Prettier integration via `eslint-plugin-prettier`

Key rules:

- `@typescript-eslint/consistent-type-imports`: error (enforce `import type`)
- `@typescript-eslint/no-shadow`: error
- `complexity`: warn at 10
- `eqeqeq`: error (strict equality)
- `react-hooks/exhaustive-deps`: error
- Import ordering and consistency enforced
- No default exports (except in example workspace)

**Prettier**: 4-space tabs, single quotes, 100 char line width, semicolons enabled

## Important Dependencies

All these are peer dependencies and must be installed:

- `@shopify/flash-list` >=2 - High-performance list component
- `expo-image` - Optimized image rendering
- `expo-haptics` - Haptic feedback
- `react` >=19 - React framework (minimum version 19)
- `react-native-gesture-handler` - Gesture detection
- `react-native-reanimated` >=4 - Smooth animations (minimum version 4)
- `react-native-safe-area-context` - Safe area support
- `react-native-svg` - SVG support for icons
- `react-native-worklets` - Worklets support for Reanimated

## Project Structure

```
src/
├── index.ts                    # Main entry point (exports all primitives)
├── primitives/
│   ├── slider-provider.tsx       # Public SliderProvider component
│   ├── slider.tsx               # Container component with gesture handling
│   ├── slider-content.tsx        # FlashList wrapper
│   ├── slider-page-counter.tsx    # Page indicator
│   ├── slider-corner.tsx         # Positioned container
│   ├── slider-full-screen.tsx     # Modal full-screen
│   ├── slider-close-button.tsx    # Close button
│   ├── slider-description.tsx    # Description overlay
│   ├── slider-empty.tsx          # Empty state component
│   └── index.ts                 # Barrel export
├── context/
│   ├── slider-context.tsx        # Internal SliderContextProvider + useSlider hook
│   └── slider-full-screen-context.tsx # Full-screen context utilities
├── hooks/
│   ├── use-slider-state.ts        # Internal state management
│   ├── use-image-aspect-ratio.ts  # Image aspect ratio hook
│   ├── use-registered-callback.ts # Callback registration hook
│   └── slider-state/             # State management hooks
│       ├── use-slider-full-screen.ts
│       ├── use-slider-navigation.ts
│       └── use-slider-callbacks.ts
├── types/
│   ├── context.ts               # Context and SliderItem types
│   ├── slider-state.ts          # Slider state types
│   ├── common.ts                # Common shared types
│   ├── icons.ts                 # IconsProps (extends SvgProps)
│   ├── pinch-to-zoom.ts         # PinchToZoomStatus type
│   └── index.ts                 # Type exports
├── utils/
│   ├── clamp.ts                 # Worklet-compatible value clamping
│   └── capitalize.ts            # String capitalization utility
├── icons/
│   └── icon-x.tsx                # Close button icon
├── constants/
│   └── layout.ts                # Layout constants (z-index, thresholds)
└── internal/
    └── pinch-to-zoom.tsx          # Internal gesture wrapper

example/                         # Expo example app
├── src/App.tsx                  # Demo implementation with new API
└── assets/photos/               # Sample images

lib/                             # Built output (generated, git-ignored)
```

## Important Implementation Details

### FlashList Scrolling

SliderContent uses FlashList with:

- `pagingEnabled={true}` for snap-to-page behavior
- `viewabilityConfig` with threshold to track current visible item
- Dynamic item width measurement via `onCommitLayoutEffect`
- Custom `renderScrollComponent` using `react-native-gesture-handler` ScrollView for pinch-to-zoom compatibility

### Pinch-to-Zoom Integration

When `enablePinchToZoom` is enabled:

- Wraps FlashList in internal `PinchToZoom` component
- Temporarily disables scroll when gesture is active
- Uses `disableScrollViewPanResponder` to coordinate gestures
- Provides callbacks for scale changes and dismissal

## Release Process

Releases are managed with `release-it`:

1. Commits follow conventional format (feat, fix, docs, etc.)
2. Run `yarn release` to bump version and publish
3. Creates git tag: `v${version}`
4. Publishes to npm: `@one-am/react-native-simple-image-slider`
5. Creates GitLab release

Current version: 1.0.0-beta.1

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

- `SliderProvider`, `Slider`, `SliderContent`, `SliderPageCounter`, `SliderCorner`, `SliderFullScreen`, `SliderCloseButton`, `SliderDescription`, `SliderEmpty`
- `useSlider` hook
- `SliderProviderProps`, `SliderContextValue` types

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
<SliderProvider data={images}>
    <Slider>
        <SliderContent />
        <SliderCorner position="bottom-left">
            <SliderPageCounter />
        </SliderCorner>
        <SliderCorner position="top-right">
            <Badge />
        </SliderCorner>
        <SliderFullScreen>
            <SliderContent enablePinchToZoom />
            <SliderCloseButton />
        </SliderFullScreen>
    </Slider>
</SliderProvider>
```

## Workspace Setup

This is a Yarn 3 workspace with:

- Root: Library code
- `example/`: Expo app for testing

Use `yarn example <command>` to run commands in the example workspace.

## Coding Conventions

**Export Style**:

- All exports at the end of files
- Always use `export type` for types (enforced by ESLint)
- No default exports (except in example workspace)
- Use named exports for all components and utilities

**React Patterns**:

- Each file contains maximum one component
- Prefer destructuring in function signature over destructuring in body
- Never use `&&` for conditional rendering, always use ternary operator
- Components use `forwardRef` when exposing refs

**Import Style**:

- Use `import type` for type-only imports (enforced by `verbatimModuleSyntax`)
- Imports ordered automatically by ESLint

**Example**:

```typescript
// ✅ Good
import type { FC } from 'react';
import { useCallback } from 'react';

function MyComponent({ value, onPress }: Props) {
    return value ? <Text>{value}</Text> : null;
}

export type { Props };
export { MyComponent };

// ❌ Bad
import { FC, useCallback } from 'react'; // missing 'type' for FC
export default MyComponent; // no default exports
function MyComponent(props: Props) {
    const { value, onPress } = props; // destructure in signature instead
    return value && <Text>{value}</Text>; // use ternary, not &&
}
```
