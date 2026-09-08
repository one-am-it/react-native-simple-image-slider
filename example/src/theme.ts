import { useColorScheme } from 'react-native';

type Palette = {
    background: string;
    surface: string;
    border: string;
    text: string;
    muted: string;
    accent: string;
    accentText: string;
    /** Drawn over a photo, so it cannot follow the colour scheme. */
    onPhoto: string;
    scrim: string;
};

const light: Palette = {
    background: '#f2f2f7',
    surface: '#ffffff',
    border: '#e0e0e6',
    text: '#1c1c1e',
    muted: '#6e6e73',
    accent: '#007aff',
    accentText: '#ffffff',
    onPhoto: '#ffffff',
    scrim: 'rgba(0, 0, 0, 0.55)',
};

const dark: Palette = {
    background: '#000000',
    surface: '#1c1c1e',
    border: '#38383a',
    text: '#f2f2f7',
    muted: '#98989d',
    accent: '#0a84ff',
    accentText: '#ffffff',
    onPhoto: '#ffffff',
    scrim: 'rgba(0, 0, 0, 0.55)',
};

function usePalette(): Palette {
    return useColorScheme() === 'dark' ? dark : light;
}

export type { Palette };
export { usePalette };
