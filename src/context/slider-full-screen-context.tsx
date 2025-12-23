import React, { createContext, useContext } from 'react';
import type { PropsWithChildren } from 'react';

const SliderFullScreenContext = createContext<boolean | null>(null);

function SliderFullScreenProvider({ children }: PropsWithChildren) {
    return <SliderFullScreenContext value={true}>{children}</SliderFullScreenContext>;
}

function useIsFullScreenSlider(): boolean {
    const context = useContext(SliderFullScreenContext);

    return context ?? false;
}

export { SliderFullScreenProvider, useIsFullScreenSlider };
