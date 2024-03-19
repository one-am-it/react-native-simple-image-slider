import 'styled-components/native';

export type SimpleImageSliderTheme = {
    colors: {
        pageCounterBackground: string;
        pageCounterBorder: string;
        fullScreenCloseButton: string;
        descriptionContainerBorder: string;
    };
    styles: {
        spacing: {
            xxs: number;
            xs: number;
            s: number;
            m: number;
            l: number;
            xl: number;
        };
        borderRadius: {
            xs: number;
            s: number;
            m: number;
            l: number;
            xl: number;
        };
        borderWidth: {
            xs: number;
            s: number;
            m: number;
            l: number;
            xl: number;
        };
    };
};

declare module 'styled-components/native' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface DefaultTheme extends SimpleImageSliderTheme {}
}
