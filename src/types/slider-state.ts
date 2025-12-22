import type { RefObject } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import type { FlashListRef } from '@shopify/flash-list';
import type { SliderItem } from './context';
import type { PinchToZoomStatus } from './pinch-to-zoom';
import type { RegisteredCallbackConfiguration } from './common';

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

type SliderCallbacksState = RegisteredCallbackConfiguration<
    (item: SliderItem, index: number) => void,
    'itemPress'
>;

type SliderPinchState = {
    onPinchStatusChange?: (status: PinchToZoomStatus) => void;
    onPinchDismiss?: () => void;
};

type SliderContextValue = SliderDataState &
    SliderAspectRatioState &
    SliderNavigationState &
    SliderLayoutState &
    SliderFullScreenState &
    SliderCallbacksState &
    SliderPinchState;

export type {
    SliderDataState,
    SliderAspectRatioState,
    SliderNavigationState,
    SliderLayoutState,
    SliderFullScreenState,
    SliderCallbacksState,
    SliderPinchState,
    SliderContextValue,
};
