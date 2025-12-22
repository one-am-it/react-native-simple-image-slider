import React, { createContext, useContext, useMemo } from 'react';
import type { SliderContextValue, SliderProviderProps } from '../types/context';
import { useSliderState } from '../hooks';

const SliderContext = createContext<SliderContextValue | null>(null);

function SliderProvider({ children, ...props }: SliderProviderProps) {
    const state = useSliderState(props);

    const contextValue = useMemo(() => state, [state]);

    return <SliderContext value={contextValue}>{children}</SliderContext>;
}

function useSlider(): SliderContextValue {
    const context = useContext(SliderContext);

    if (!context) {
        throw new Error('useSlider must be used within a Slider component');
    }

    return context;
}

export { SliderProvider, useSlider };
