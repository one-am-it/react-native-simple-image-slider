# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native image slider library (`@one-am/react-native-simple-image-slider`) built with performance as a priority. It uses FlashList for efficient scrolling and expo-image for optimized image rendering. The library includes a basic slider component and a full-screen gallery with pinch-to-zoom gesture support.

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

### Component Hierarchy

The library exports three main slider components:

1. **BaseSimpleImageSlider** (`src/BaseSimpleImageSlider.tsx`) - Core foundation component
    - Uses `@shopify/flash-list` for horizontal scrolling performance
    - Handles image rendering with `expo-image`
    - Provides ref forwarding to FlashList for imperative control (`.scrollToIndex()`)
    - Supports custom page counter, corner components (TopLeft, TopRight, etc.)

2. **SimpleImageSlider** (`src/SimpleImageSlider.tsx`) - Standard slider with optional full-screen
    - Wraps BaseSimpleImageSlider
    - Optionally includes FullScreenImageSlider modal on image press
    - Pass `fullScreenEnabled={true}` to enable full-screen gallery

3. **FullScreenImageSlider** (`src/FullScreenImageSlider.tsx`) - Modal full-screen gallery
    - Uses React Native Modal component
    - Reuses BaseSimpleImageSlider internally for consistency
    - Includes status bar color management and safe area support
    - Fade in/out animations with Reanimated

### Supporting Components

- **PinchToZoom** (`src/PinchToZoom.tsx`) - Gesture wrapper for zoom/pan
    - Uses `react-native-gesture-handler` for pinch/pan/tap detection
    - Animated with `react-native-reanimated` for 60fps performance
    - Includes haptic feedback on zoom start/end

- **PageCounter** (`src/PageCounter.tsx`) - Page indicator (e.g., "1/10")

- **SimpleImageSliderThemeProvider** (`src/SimpleImageSliderThemeProvider.tsx`) - Theme context
    - Simple color-based theming (pageCounterBackground, pageCounterBorder, fullScreenCloseButton, descriptionContainerBorder)

### Key Design Patterns

**Render Props Pattern**: Most visual elements support render props for customization:

```typescript
type RenderProp = React.ComponentType<unknown> | React.ReactElement | undefined | null;
```

Used for: PageCounter, corner components, close button, descriptions.

**Note:** The `RenderProp` type does not accept strings to maintain type safety and clarity.

**Ref Forwarding**: All components use `forwardRef` to expose FlashList refs for programmatic scrolling:

```typescript
sliderRef.current?.scrollToIndex({ index: 2, animated: true });
```

**Composition**: Components are built to be composed together. BaseSimpleImageSlider is reused in both SimpleImageSlider and FullScreenImageSlider.

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
├── index.tsx                          # Main entry point (exports all components)
├── BaseSimpleImageSlider.tsx          # Core list slider (exported as BaseSimpleImageSlider)
├── SimpleImageSlider.tsx              # Standard slider with optional full-screen
├── FullScreenImageSlider.tsx          # Full-screen modal gallery
├── PinchToZoom.tsx                    # Gesture handler for zoom/pan
├── PageCounter.tsx                    # Page indicator component
├── SimpleImageSliderThemeProvider.tsx # Theme context provider
├── AbsoluteComponentContainer.tsx     # Layout utility for corner components
├── @types/                            # Type definitions
│   ├── icons.ts                       # IconsProps (extends SvgProps from react-native-svg)
│   ├── pinch-to-zoom.ts               # PinchToZoomStatus type
│   └── slider.ts                      # SimpleImageSliderItem type
├── utils/                             # Utility functions
│   ├── clamp.ts                       # Worklet-compatible value clamping
│   └── renderProp.tsx                 # RenderProp utility and type
└── icons/                             # SVG icons
    └── IconX.tsx                      # Close button icon

example/                               # Expo example app
├── src/App.tsx                        # Demo implementation
└── assets/photos/                     # Sample images

lib/                                   # Built output (generated, git-ignored)
```

## iOS Scrolling Quirk

BaseSimpleImageSlider includes a platform-specific workaround for iOS scroll behavior:

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

Current version: 0.16.1

## Recent Changes (v0.17.0 Breaking Changes)

### Export Naming

- **Breaking:** `BaseListImageSlider` renamed to `BaseSimpleImageSlider` for consistency with component name and types.

### Type System Improvements

- **Breaking:** Removed `string` from `RenderProp` type for better type safety.
- Added exports for `RenderProp` and `PinchToZoomStatus` types.
- Fixed `IconsProps` to use `SvgProps` from `react-native-svg` instead of web SVG types.

### Code Quality

- Removed all `@ts-ignore` suppressions with proper typing.
- Removed empty `src/@types/common.ts` file.
- Corrected misleading JSDoc comments about imageWidth/imageHeight auto-calculation.

### Documentation

- Comprehensive README with full API reference for all components.
- Theme customization guide with examples.
- Advanced usage patterns (refs, corner components, custom page counters).
- Complete type documentation.

## Workspace Setup

This is a Yarn 3 workspace with:

- Root: Library code
- `example/`: Expo app for testing

Use `yarn example <command>` to run commands in the example workspace.
