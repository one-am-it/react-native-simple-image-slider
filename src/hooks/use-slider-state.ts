import { useCallback } from 'react';
import type { SliderContextValue, SliderProviderProps } from '../types/context';
import {
    useImageAspectRatio,
    useSliderNavigation,
    useSliderFullScreen,
    useSliderCallbacks,
} from './slider-state';

export function useSliderState({
    data,
    initialIndex,
    imageAspectRatio: aspectRatioOverride,
    ...propCallbacks
}: Omit<SliderProviderProps, 'children'>): SliderContextValue {
    // Get first image source for aspect ratio detection
    const firstImageSource = data?.[0]?.source;

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

    // Create wrappers that update state AND dispatch callbacks
    const setCurrentIndex = useCallback(
        (index: number) => {
            setCurrentIndexRaw(index);
            onIndexChangeDispatcher(index);
        },
        [setCurrentIndexRaw, onIndexChangeDispatcher]
    );

    const openFullScreen = useCallback(() => {
        setIsFullScreenOpen(true);
        onFullScreenChangeDispatcher(true);
    }, [setIsFullScreenOpen, onFullScreenChangeDispatcher]);

    const closeFullScreen = useCallback(() => {
        setIsFullScreenOpen(false);
        onFullScreenChangeDispatcher(false);
    }, [setIsFullScreenOpen, onFullScreenChangeDispatcher]);

    const totalItems = data?.length ?? 0;

    return {
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
        ...callbacks,
    };
}
