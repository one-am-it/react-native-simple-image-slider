import React, { type PropsWithChildren, useMemo } from 'react';
import { type DefaultTheme, ThemeProvider } from 'styled-components/native';

export default function StyledComponentsThemeProvider({ children }: PropsWithChildren) {
    const styles = useMemo(
        () => ({
            spacing: {
                xxs: 2,
                xs: 4,
                s: 8,
                m: 16,
                l: 20,
                xl: 40,
            },
            borderRadius: {
                xs: 2,
                s: 4,
                m: 8,
                l: 16,
                xl: 24,
            },
            borderWidth: {
                xs: 1,
                s: 2,
                m: 4,
                l: 8,
                xl: 16,
            },
        }),

        []
    );

    const theme: DefaultTheme = useMemo(
        () => ({
            colors: {
                pageCounterBackground: '#D3D3D3',
                pageCounterBorder: '#000000',
                fullScreenCloseButton: '#FFFFFF',
                descriptionContainerBorder: '#FFFFFF',
            },
            styles,
        }),
        [styles]
    );

    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
