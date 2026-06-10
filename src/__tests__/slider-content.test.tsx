import React from 'react';
import type { View as RNView } from 'react-native';
import { render } from '@testing-library/react-native';
import { SliderContent } from '../primitives/slider-content';
import { useSliderContext } from '../context/slider-context';
import { useIsFullScreenSlider } from '../context/slider-full-screen-context';

jest.mock('@shopify/flash-list', () => {
    const ReactLocal = require('react') as typeof React;
    const { View } = require('react-native') as { View: typeof RNView };
    return {
        FlashList: ({ style }: { style?: object }) =>
            ReactLocal.createElement(View, { testID: 'flash-list', style }),
    };
});

jest.mock('expo-image', () => ({
    Image: jest.fn(() => null),
    useImage: jest.fn(() => null),
}));

jest.mock('react-native-gesture-handler', () => ({
    ScrollView: jest.fn(() => null),
}));

jest.mock('../internal/pinch-to-zoom', () => {
    const ReactLocal = require('react') as typeof React;
    const { View } = require('react-native') as { View: typeof RNView };
    return {
        PinchToZoom: ({ children }: { children: React.ReactNode }) =>
            ReactLocal.createElement(View, { testID: 'pinch-to-zoom' }, children),
    };
});

jest.mock('../context/slider-context');
jest.mock('../context/slider-full-screen-context');

const mockUseSliderContext = useSliderContext as jest.MockedFunction<typeof useSliderContext>;
const mockUseIsFullScreenSlider = useIsFullScreenSlider as jest.MockedFunction<
    typeof useIsFullScreenSlider
>;

const baseContext = {
    data: [{ key: '1', source: { uri: 'https://example.com/a.jpg' } }],
    totalItems: 1,
    currentIndex: 0,
    setCurrentIndex: jest.fn(),
    imageAspectRatio: 16 / 9,
    containerWidth: 0,
    registerScrollFn: jest.fn(() => () => {}),
    onItemPress: undefined,
    hasFullScreen: false,
    openFullScreen: jest.fn(),
    onPinchStatusChange: undefined,
    onPinchDismiss: undefined,
} as unknown as ReturnType<typeof useSliderContext>;

describe('SliderContent', () => {
    describe('containerWidth gate', () => {
        beforeEach(() => {
            mockUseIsFullScreenSlider.mockReturnValue(false);
        });

        it('renders null when containerWidth is 0 in non-fullscreen mode', async () => {
            mockUseSliderContext.mockReturnValue({ ...baseContext, containerWidth: 0 });
            const { toJSON } = await render(<SliderContent />);
            expect(toJSON()).toBeNull();
        });

        it('renders the list when containerWidth > 0 in non-fullscreen mode', async () => {
            mockUseSliderContext.mockReturnValue({ ...baseContext, containerWidth: 320 });
            const { getByTestId } = await render(<SliderContent />);
            expect(getByTestId('flash-list')).toBeTruthy();
        });

        it('renders the list when fullscreen even if containerWidth is 0', async () => {
            mockUseIsFullScreenSlider.mockReturnValue(true);
            mockUseSliderContext.mockReturnValue({ ...baseContext, containerWidth: 0 });
            const { getByTestId } = await render(<SliderContent />);
            expect(getByTestId('flash-list')).toBeTruthy();
        });

        it('renders null when totalItems is 0 regardless of containerWidth', async () => {
            mockUseSliderContext.mockReturnValue({
                ...baseContext,
                containerWidth: 320,
                totalItems: 0,
                data: [],
            });
            const { toJSON } = await render(<SliderContent />);
            expect(toJSON()).toBeNull();
        });
    });
});
