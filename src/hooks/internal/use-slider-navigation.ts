import { useCallback, useEffect, useRef, useState } from 'react';
import type { FlashListRef } from '@shopify/flash-list';
import type { SliderItem } from '../../types/context';
import type { SliderNavigationState } from '../../types/slider-state';

export function useSliderNavigation({
    initialIndex = 0,
    onIndexChange,
}: {
    initialIndex?: number;
    onIndexChange?: (index: number) => void;
}): SliderNavigationState {
    const listRef = useRef<FlashListRef<SliderItem> | null>(null);
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    const handleSetCurrentIndex = useCallback(
        (index: number) => {
            setCurrentIndex(index);
            onIndexChange?.(index);
        },
        [onIndexChange]
    );

    const scrollToIndex = useCallback((index: number, animated: boolean = true) => {
        listRef.current?.scrollToIndex({ index, animated });
    }, []);

    useEffect(() => {
        if (initialIndex !== undefined) {
            setCurrentIndex(initialIndex);
            requestAnimationFrame(() => {
                listRef.current?.scrollToIndex({ index: initialIndex, animated: false });
            });
        }
    }, [initialIndex]);

    return {
        currentIndex,
        setCurrentIndex: handleSetCurrentIndex,
        listRef,
        scrollToIndex,
    };
}
