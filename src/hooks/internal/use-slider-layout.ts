import { useCallback, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import type { SliderLayoutState } from '../../types/slider-state';

export function useSliderLayout(): SliderLayoutState {
    const [containerWidth, setContainerWidth] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);

    const onLayout = useCallback((event: LayoutChangeEvent) => {
        setContainerWidth(event.nativeEvent.layout.width);
        setContainerHeight(event.nativeEvent.layout.height);
    }, []);

    return {
        containerWidth,
        containerHeight,
        onLayout,
    };
}
