import 'styled-components/native';

export type SimpleImageSliderTheme = {
    colors: {
        simpleImageSlider: {
            pageCounterBackground: string;
            pageCounterBorder: string;
            fullScreenCloseButton: string;
            descriptionContainerBorder: string;
        };
    };
};

declare module 'styled-components/native' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface DefaultTheme extends SimpleImageSliderTheme {}
}
