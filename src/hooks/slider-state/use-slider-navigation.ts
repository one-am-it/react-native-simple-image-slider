import { useCallback, useRef, useState } from 'react';
import type { SliderNavigationState } from '../../types/slider-state';

type ScrollToIndexFn = (index: number, animated?: boolean) => void;

export function useSliderNavigation({
    initialIndex = 0,
}: {
    initialIndex?: number;
}): SliderNavigationState {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const scrollFnRef = useRef<ScrollToIndexFn | null>(null);

    const registerScrollFn = useCallback((fn: ScrollToIndexFn) => {
        scrollFnRef.current = fn;

        return () => {
            scrollFnRef.current = null;
        };
    }, []);

    const scrollToIndex = useCallback((index: number, animated: boolean = true) => {
        scrollFnRef.current?.(index, animated);
    }, []);

    return {
        currentIndex,
        setCurrentIndex,
        registerScrollFn,
        scrollToIndex,
    };
}
