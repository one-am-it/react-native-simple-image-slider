import React, { createContext, type PropsWithChildren, useContext, useMemo } from 'react';

export type SimpleImageSliderTheme = {
    colors: {
        pageCounterBackground: string;
        pageCounterBorder: string;
        fullScreenCloseButton: string;
        descriptionContainerBorder: string;
    };
};

const defaultTheme: SimpleImageSliderTheme = {
    colors: {
        pageCounterBackground: '#D3D3D3',
        pageCounterBorder: '#000000',
        fullScreenCloseButton: '#FFFFFF',
        descriptionContainerBorder: '#FFFFFF',
    },
};

const ThemeContext = createContext<SimpleImageSliderTheme>(defaultTheme);

export type SimpleImageSliderThemeProviderProps = PropsWithChildren<{
    overrides?: {
        colors: Partial<SimpleImageSliderTheme['colors']>;
    };
}>;

export function useSimpleImageSliderTheme() {
    return useContext(ThemeContext);
}

export default function SimpleImageSliderThemeProvider({
    overrides,
    children,
}: SimpleImageSliderThemeProviderProps) {
    const theme: SimpleImageSliderTheme = useMemo(
        () => ({
            ...defaultTheme,
            colors: {
                ...defaultTheme.colors,
                ...overrides?.colors,
            },
        }),
        [overrides?.colors]
    );

    return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}
