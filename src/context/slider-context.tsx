import React, { createContext, useContext, useMemo } from 'react';
import type { SliderContextValue, SliderProviderProps } from '../types/context';
import { useSliderState } from '../hooks';

const SliderContext = createContext<SliderContextValue | null>(null);

function SliderProvider(props: SliderProviderProps) {
    const { children } = props;
    const state = useSliderState(props);

    const contextValue = useMemo(() => state, [state]);

    return <SliderContext.Provider value={contextValue}>{children}</SliderContext.Provider>;
}

function useSlider(): SliderContextValue {
    const context = useContext(SliderContext);

    if (!context) {
        throw new Error('useSlider must be used within a Slider component');
    }

    return context;
}

export { SliderProvider, useSlider };
