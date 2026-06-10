import { useCallback, useMemo, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import type { SliderProviderProps, SliderState } from '../types';
import {
    useImageAspectRatio,
    useSliderCallbacks,
    useSliderFullScreen,
    useSliderNavigation,
} from './slider-state';

export function useSliderState({
    data,
    initialIndex,
    imageAspectRatio: aspectRatioOverride,
    statusBarStyle = 'auto',
    ...propCallbacks
}: Omit<SliderProviderProps, 'children'>): SliderState {
    // Get first image source for aspect ratio detection
    const firstImageSource = data?.[0]?.source;

    // State for slider container size, used to ensure images all images has always width when rendering non-fullscreen sliders
    const [containerWidth, setContainerWidth] = useState(0);
    const handleLayout = useCallback((e: LayoutChangeEvent) => {
        setContainerWidth(e.nativeEvent.layout.width);
    }, []);

    // Compose specialized hooks (callbacks first since it has no dependencies)
    const callbacks = useSliderCallbacks(propCallbacks);
    const aspectRatio = useImageAspectRatio(firstImageSource, aspectRatioOverride);
    const navigation = useSliderNavigation({ initialIndex });
    const fullScreen = useSliderFullScreen();

    // Destructure stable setState functions and callback dispatchers
    const { setCurrentIndex: setCurrentIndexRaw } = navigation;
    const { setIsFullScreenOpen } = fullScreen;
    const {
        onIndexChange: onIndexChangeDispatcher,
        onFullScreenChange: onFullScreenChangeDispatcher,
    } = callbacks;

    const totalItems = data?.length ?? 0;

    // Create wrappers that update state AND dispatch callbacks
    const setCurrentIndex = useCallback(
        (index: number) => {
            if (totalItems === 0) return;
            const clampedIndex = Math.max(0, Math.min(index, totalItems - 1));
            setCurrentIndexRaw(clampedIndex);
            onIndexChangeDispatcher(clampedIndex);
        },
        [setCurrentIndexRaw, onIndexChangeDispatcher, totalItems]
    );

    const openFullScreen = useCallback(() => {
        setIsFullScreenOpen(true);
        onFullScreenChangeDispatcher(true);
    }, [setIsFullScreenOpen, onFullScreenChangeDispatcher]);

    const closeFullScreen = useCallback(() => {
        setIsFullScreenOpen(false);
        onFullScreenChangeDispatcher(false);
    }, [setIsFullScreenOpen, onFullScreenChangeDispatcher]);

    return useMemo(
        () => ({
            data,
            totalItems,
            ...aspectRatio,
            currentIndex: navigation.currentIndex,
            registerScrollFn: navigation.registerScrollFn,
            scrollToIndex: navigation.scrollToIndex,
            setCurrentIndex,
            isFullScreenOpen: fullScreen.isFullScreenOpen,
            hasFullScreen: fullScreen.hasFullScreen,
            registerFullScreen: fullScreen.registerFullScreen,
            openFullScreen,
            closeFullScreen,
            statusBarStyle,
            containerWidth,
            handleLayout,
            ...callbacks,
        }),
        [
            data,
            totalItems,
            aspectRatio,
            navigation.currentIndex,
            navigation.registerScrollFn,
            navigation.scrollToIndex,
            setCurrentIndex,
            fullScreen.isFullScreenOpen,
            fullScreen.hasFullScreen,
            fullScreen.registerFullScreen,
            openFullScreen,
            closeFullScreen,
            statusBarStyle,
            containerWidth,
            handleLayout,
            callbacks,
        ]
    );
}
