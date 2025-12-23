import React from 'react';
import { SliderContextProvider } from '../context/slider-context';
import type { SliderProviderProps } from '../types';

function SliderProvider({ children, ...props }: SliderProviderProps) {
    return <SliderContextProvider {...props}>{children}</SliderContextProvider>;
}

export { SliderProvider };
