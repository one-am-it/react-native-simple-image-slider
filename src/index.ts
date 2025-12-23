export {
    Slider,
    SliderContent,
    SliderPageCounter,
    SliderCorner,
    SliderFullScreen,
    SliderCloseButton,
    SliderDescription,
    SliderEmpty,
} from './primitives';

export type {
    SliderProps,
    SliderContentProps,
    SliderPageCounterProps,
    SliderCornerProps,
    SliderFullScreenProps,
    SliderCloseButtonProps,
    SliderDescriptionProps,
    SliderEmptyProps,
} from './primitives';

export { useSlider } from './context/slider-context';
export type { SliderItem, SliderContextValue } from './types/context';
export type { PinchToZoomStatus } from './types/pinch-to-zoom';
