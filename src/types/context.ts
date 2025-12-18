import type { RefObject, ReactNode } from 'react';
import type { StyleProp, ViewStyle, LayoutChangeEvent } from 'react-native';
import type { FlashListRef } from '@shopify/flash-list';
import type { ImageProps } from 'expo-image';

export type SliderItem = ImageProps & {
    key: string;
};

export type SliderContextValue = {
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
    registerOnItemPress: (handler: (item: SliderItem, index: number) => void) => void;

    // Layout
    handleLayout: (event: LayoutChangeEvent) => void;
};

export type SliderProviderProps = {
    children: ReactNode;
    data: SliderItem[];
    initialIndex?: number;
    imageAspectRatio?: number;
    style?: StyleProp<ViewStyle>;
    onIndexChange?: (index: number) => void;
    onItemPress?: (item: SliderItem, index: number) => void;
    onFullScreenChange?: (isOpen: boolean) => void;
};
