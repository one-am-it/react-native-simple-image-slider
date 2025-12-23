import React, { createContext, useContext } from 'react';
import type { SliderContextValue, SliderProviderProps, SliderPublicState } from '../types';
import { useSliderState } from '../hooks';

const SliderContext = createContext<SliderContextValue | null>(null);

function SliderContextProvider({ children, ...props }: SliderProviderProps) {
    const contextValue = useSliderState(props);

    return <SliderContext value={contextValue}>{children}</SliderContext>;
}

function useSliderContext(): SliderContextValue {
    const context = useContext(SliderContext);

    if (!context) {
        throw new Error('useSliderContext must be used within a SliderProvider component');
    }

    return context;
}

function useSlider(): SliderPublicState {
    const context = useSliderContext();

    return {
        data: context.data,
        totalItems: context.totalItems,
        imageAspectRatio: context.imageAspectRatio,
        isAspectRatioLoading: context.isAspectRatioLoading,
        currentIndex: context.currentIndex,
        scrollToIndex: context.scrollToIndex,
        isFullScreenOpen: context.isFullScreenOpen,
        openFullScreen: context.openFullScreen,
        closeFullScreen: context.closeFullScreen,
        hasFullScreen: context.hasFullScreen,
    };
}

export { SliderContextProvider, useSliderContext, useSlider };
