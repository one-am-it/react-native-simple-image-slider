import { useCallback, useState } from 'react';
import type { SliderItem } from '../../types/context';
import type { SliderCallbacksState } from '../../types/slider-state';

export function useSliderCallbacks({
    onItemPress: onItemPressProp,
}: {
    onItemPress?: (item: SliderItem, index: number) => void;
}): SliderCallbacksState {
    const [onItemPressCallback, setOnItemPressCallback] = useState<
        ((item: SliderItem, index: number) => void) | undefined
    >(() => onItemPressProp);

    const registerOnItemPress = useCallback(
        (handler: (item: SliderItem, index: number) => void) => {
            setOnItemPressCallback(() => handler);
        },
        []
    );

    return {
        onItemPress: onItemPressCallback,
        registerOnItemPress,
    };
}
