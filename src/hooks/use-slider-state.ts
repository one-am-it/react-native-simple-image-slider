import type { SliderContextValue, SliderProviderProps } from '../types/context';
import {
    useImageAspectRatio,
    useSliderNavigation,
    useSliderLayout,
    useSliderFullScreen,
    useSliderCallbacks,
} from './internal';

export function useSliderState(props: SliderProviderProps): SliderContextValue {
    const {
        data,
        initialIndex,
        imageAspectRatio: aspectRatioOverride,
        onIndexChange,
        onItemPress,
        onFullScreenChange,
        onPinchStatusChange,
        onPinchDismiss,
    } = props;

    // Get first image source for aspect ratio detection
    const firstImageSource = data?.[0]?.source;

    // Compose specialized hooks
    const aspectRatio = useImageAspectRatio(firstImageSource, aspectRatioOverride);
    const navigation = useSliderNavigation({ initialIndex, onIndexChange });
    const layout = useSliderLayout();
    const fullScreen = useSliderFullScreen({ onFullScreenChange });
    const callbacks = useSliderCallbacks({ onItemPress });

    const totalItems = data?.length ?? 0;

    return {
        data,
        totalItems,
        ...aspectRatio,
        ...navigation,
        ...layout,
        ...fullScreen,
        ...callbacks,
        onPinchStatusChange,
        onPinchDismiss,
    };
}
