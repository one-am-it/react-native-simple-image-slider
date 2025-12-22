import type { SliderItem } from '../../types/context';
import type { SliderCallbacksState } from '../../types/slider-state';
import { useRegisteredCallback } from '../use-registered-callback';

type UseSliderCallbacksInput = {
    onItemPress?: (item: SliderItem, index: number) => void;
};

function useSliderCallbacks({
    onItemPress: onItemPressProp,
}: UseSliderCallbacksInput): SliderCallbacksState {
    const { onItemPress, registerOnItemPress } = useRegisteredCallback({
        handler: onItemPressProp,
        name: 'itemPress',
    });

    return {
        onItemPress,
        registerOnItemPress,
    };
}

export { useSliderCallbacks };
