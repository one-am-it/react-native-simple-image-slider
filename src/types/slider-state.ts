import type { RefObject } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import type { FlashListRef } from '@shopify/flash-list';
import type { SliderItem } from './context';

type SliderDataState = {
    data: SliderItem[];
    totalItems: number;
};

type SliderAspectRatioState = {
    imageAspectRatio: number;
    isAspectRatioLoading: boolean;
};

type SliderNavigationState = {
    currentIndex: number;
    setCurrentIndex: (index: number) => void;
    listRef: RefObject<FlashListRef<SliderItem> | null>;
    scrollToIndex: (index: number, animated?: boolean) => void;
};

type SliderLayoutState = {
    containerWidth: number;
    containerHeight: number;
    onLayout: (event: LayoutChangeEvent) => void;
};

type SliderFullScreenState = {
    isFullScreenOpen: boolean;
    openFullScreen: () => void;
    closeFullScreen: () => void;
    hasFullScreen: boolean;
    registerFullScreen: () => void;
    unregisterFullScreen: () => void;
};

type SliderCallbacksState = {
    onItemPress?: (item: SliderItem, index: number) => void;
    registerOnItemPress: (handler: (item: SliderItem, index: number) => void) => void;
};

type SliderContextValue = SliderDataState &
    SliderAspectRatioState &
    SliderNavigationState &
    SliderLayoutState &
    SliderFullScreenState &
    SliderCallbacksState;

export type {
    SliderDataState,
    SliderAspectRatioState,
    SliderNavigationState,
    SliderLayoutState,
    SliderFullScreenState,
    SliderCallbacksState,
    SliderContextValue,
};
