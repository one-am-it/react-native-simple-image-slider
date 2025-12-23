import type { SliderItem } from './context';
import type { PinchToZoomStatus } from './pinch-to-zoom';
import type { RegisteredCallbacksFromEvents } from './common';

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
    registerScrollFn: (fn: (index: number, animated?: boolean) => void) => () => void;
    scrollToIndex: (index: number, animated?: boolean) => void;
};

type SliderFullScreenState = {
    isFullScreenOpen: boolean;
    openFullScreen: () => void;
    closeFullScreen: () => void;
    hasFullScreen: boolean;
    registerFullScreen: () => () => void;
};

type SliderEvents = {
    itemPress: (item: SliderItem, index: number) => void;
    fullScreenChange: (isFullScreen: boolean) => void;
    indexChange: (index: number) => void;
    pinchStatusChange: (status: PinchToZoomStatus) => void;
    pinchDismiss: () => void;
};

type SliderCallbacksState = RegisteredCallbacksFromEvents<SliderEvents>;

type SliderStatusBarState = {
    statusBarStyle: 'light' | 'dark' | 'auto';
};

type SliderState = SliderDataState &
    SliderAspectRatioState &
    SliderNavigationState &
    SliderFullScreenState &
    SliderCallbacksState &
    SliderStatusBarState;

export type {
    SliderDataState,
    SliderAspectRatioState,
    SliderNavigationState,
    SliderFullScreenState,
    SliderEvents,
    SliderCallbacksState,
    SliderStatusBarState,
    SliderState,
};
