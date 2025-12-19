import { useCallback, useEffect, useRef, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import type { FlashListRef } from '@shopify/flash-list';
import type { SliderContextValue, SliderProviderProps, SliderItem } from '../types/context';

export function useSliderState(props: SliderProviderProps): SliderContextValue {
    const {
        data,
        initialIndex = 0,
        imageAspectRatio = 4 / 3,
        onIndexChange,
        onItemPress: onItemPressProp,
        onFullScreenChange,
    } = props;

    const listRef = useRef<FlashListRef<SliderItem>>(null);
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [containerWidth, setContainerWidth] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);
    const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);
    const [onItemPressCallback, setOnItemPressCallback] = useState<
        ((item: SliderItem, index: number) => void) | undefined
    >(() => onItemPressProp);

    const totalItems = data?.length ?? 0;

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

    const openFullScreen = useCallback(() => {
        setIsFullScreenOpen(true);
        onFullScreenChange?.(true);
    }, [onFullScreenChange]);

    const closeFullScreen = useCallback(() => {
        setIsFullScreenOpen(false);
        onFullScreenChange?.(false);
    }, [onFullScreenChange]);

    const registerOnItemPress = useCallback(
        (handler: (item: SliderItem, index: number) => void) => {
            setOnItemPressCallback(() => handler);
        },
        []
    );

    const handleLayout = useCallback((event: LayoutChangeEvent) => {
        setContainerWidth(event.nativeEvent.layout.width);
        setContainerHeight(event.nativeEvent.layout.height);
    }, []);

    useEffect(() => {
        if (initialIndex !== undefined) {
            setCurrentIndex(initialIndex);
            listRef.current?.scrollToIndex({ index: initialIndex, animated: false });
        }
    }, [initialIndex]);

    return {
        data,
        totalItems,
        currentIndex,
        setCurrentIndex: handleSetCurrentIndex,
        imageAspectRatio,
        containerWidth,
        containerHeight,
        listRef,
        scrollToIndex,
        isFullScreenOpen,
        openFullScreen,
        closeFullScreen,
        onItemPress: onItemPressCallback,
        registerOnItemPress,
        onLayout: handleLayout,
    };
}
