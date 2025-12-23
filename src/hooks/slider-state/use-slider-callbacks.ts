import type { SliderCallbacksState, SliderEvents, CallbacksFromEvents } from '../../types';
import { useRegisteredCallback } from '../use-registered-callback';

type UseSliderCallbacksInput = Partial<CallbacksFromEvents<SliderEvents>>;

function useSliderCallbacks({
    onItemPress: onItemPressProp,
    onFullScreenChange: onFullScreenChangeProp,
    onIndexChange: onSlideChangeProp,
    onPinchStatusChange: onPinchStatusChangeProp,
    onPinchDismiss: onPinchDismissProp,
}: UseSliderCallbacksInput): SliderCallbacksState {
    const { onItemPress, registerOnItemPress } = useRegisteredCallback({
        handler: onItemPressProp,
        name: 'itemPress',
    });

    const { onFullScreenChange, registerOnFullScreenChange } = useRegisteredCallback({
        handler: onFullScreenChangeProp,
        name: 'fullScreenChange',
    });

    const { onIndexChange, registerOnIndexChange } = useRegisteredCallback({
        handler: onSlideChangeProp,
        name: 'indexChange',
    });

    const { onPinchStatusChange, registerOnPinchStatusChange } = useRegisteredCallback({
        handler: onPinchStatusChangeProp,
        name: 'pinchStatusChange',
    });

    const { onPinchDismiss, registerOnPinchDismiss } = useRegisteredCallback({
        handler: onPinchDismissProp,
        name: 'pinchDismiss',
    });

    return {
        onItemPress,
        registerOnItemPress,
        onFullScreenChange,
        registerOnFullScreenChange,
        onIndexChange,
        registerOnIndexChange,
        onPinchStatusChange,
        registerOnPinchStatusChange,
        onPinchDismiss,
        registerOnPinchDismiss,
    };
}

export { useSliderCallbacks };
