import React, { type PropsWithChildren, useMemo } from 'react';
import { type DefaultTheme, ThemeProvider } from 'styled-components/native';

export type SimpleImageSliderThemeProviderProps = PropsWithChildren<{
    overrides?: {
        colors: Partial<DefaultTheme['colors']>;
    };
}>;

export default function SimpleImageSliderThemeProvider({
    overrides,
    children,
}: SimpleImageSliderThemeProviderProps) {
    const theme: DefaultTheme = useMemo(
        () => ({
            colors: {
                simpleImageSlider: {
                    pageCounterBackground: '#D3D3D3',
                    pageCounterBorder: '#000000',
                    fullScreenCloseButton: '#FFFFFF',
                    descriptionContainerBorder: '#FFFFFF',
                    ...overrides?.colors?.simpleImageSlider,
                },
            },
        }),
        [overrides?.colors?.simpleImageSlider]
    );

    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
