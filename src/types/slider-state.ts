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

type SliderCallbacksState = RegisteredCallbacksFromEvents<SliderEvents> & {
    /**
     * Whether a consumer passed an `onItemPress`. The `onItemPress` above is the dispatcher the
     * registration hook always returns, so it is truthy either way and cannot answer this.
     */
    hasItemPress: boolean;
};

type SliderStatusBarState = {
    statusBarStyle: 'light' | 'dark' | 'auto';
};

type SliderLayoutState = {
    containerWidth: number;
    setContainerWidth: (width: number) => void;
};

type SliderState = SliderDataState &
    SliderAspectRatioState &
    SliderNavigationState &
    SliderFullScreenState &
    SliderCallbacksState &
    SliderStatusBarState &
    SliderLayoutState;

type SliderPublicState = Pick<
    SliderState,
    | 'data'
    | 'totalItems'
    | 'imageAspectRatio'
    | 'isAspectRatioLoading'
    | 'currentIndex'
    | 'scrollToIndex'
    | 'isFullScreenOpen'
    | 'openFullScreen'
    | 'closeFullScreen'
    | 'hasFullScreen'
>;

export type {
    SliderDataState,
    SliderAspectRatioState,
    SliderNavigationState,
    SliderFullScreenState,
    SliderEvents,
    SliderCallbacksState,
    SliderStatusBarState,
    SliderLayoutState,
    SliderState,
    SliderPublicState,
};
