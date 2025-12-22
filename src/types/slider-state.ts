import type { SliderItem } from './context';
import type { PinchToZoomStatus } from './pinch-to-zoom';
import type { CallbacksFromEvents } from './common';

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

type SliderCallbacksState = CallbacksFromEvents<SliderEvents>;

type SliderPinchState = {
    onPinchStatusChange?: (status: PinchToZoomStatus) => void;
    onPinchDismiss?: () => void;
};

type SliderContextValue = SliderDataState &
    SliderAspectRatioState &
    SliderNavigationState &
    SliderFullScreenState &
    SliderCallbacksState &
    SliderPinchState;

export type {
    SliderDataState,
    SliderAspectRatioState,
    SliderNavigationState,
    SliderFullScreenState,
    SliderEvents,
    SliderCallbacksState,
    SliderPinchState,
    SliderContextValue,
};
