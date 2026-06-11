import React from 'react';
import type { View as RNView } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { Slider } from '../primitives/slider';
import { useSliderContext } from '../context/slider-context';

jest.mock('expo-image', () => ({
    Image: jest.fn(() => null),
    useImage: jest.fn(() => null),
}));

jest.mock('react-native-gesture-handler', () => {
    const ReactLocal = require('react') as typeof React;
    const { View: ViewLocal } = require('react-native') as { View: typeof RNView };
    return {
        GestureHandlerRootView: ({
            style,
            children,
        }: {
            style?: object;
            children?: React.ReactNode;
        }) => ReactLocal.createElement(ViewLocal, { testID: 'gesture-root', style }, children),
    };
});

jest.mock('../context/slider-context');

const mockUseSliderContext = useSliderContext as jest.MockedFunction<typeof useSliderContext>;

const setContainerWidth = jest.fn();

// Jest mocks View as a class component, so refs resolve to instances sharing
// View.prototype — patching it there is how we simulate the Fabric measurement API
const viewPrototype = View.prototype as unknown as {
    getBoundingClientRect?: () => { width: number; height: number };
};

describe('Slider', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseSliderContext.mockReturnValue({
            setContainerWidth,
        } as unknown as ReturnType<typeof useSliderContext>);
    });

    afterEach(() => {
        delete viewPrototype.getBoundingClientRect;
    });

    describe('synchronous measurement (getBoundingClientRect)', () => {
        it('sets containerWidth on mount when the ref exposes getBoundingClientRect', async () => {
            viewPrototype.getBoundingClientRect = () => ({ width: 375, height: 200 });

            await render(
                <Slider>
                    <Text>child</Text>
                </Slider>
            );

            expect(setContainerWidth).toHaveBeenCalledTimes(1);
            expect(setContainerWidth).toHaveBeenCalledWith(375);
        });

        it('ignores zero-width measurements', async () => {
            viewPrototype.getBoundingClientRect = () => ({ width: 0, height: 0 });

            await render(
                <Slider>
                    <Text>child</Text>
                </Slider>
            );

            expect(setContainerWidth).not.toHaveBeenCalled();
        });

        it('renders without measuring when getBoundingClientRect is unavailable', async () => {
            const { getByText } = await render(
                <Slider>
                    <Text>child</Text>
                </Slider>
            );

            expect(setContainerWidth).not.toHaveBeenCalled();
            expect(getByText('child')).toBeTruthy();
        });
    });

    describe('onLayout', () => {
        it('sets containerWidth from layout events', async () => {
            const { root } = await render(
                <Slider>
                    <Text>child</Text>
                </Slider>
            );

            if (!root) {
                throw new Error('expected Slider to render a root element');
            }

            fireEvent(root, 'layout', {
                nativeEvent: { layout: { x: 0, y: 0, width: 414, height: 300 } },
            });

            expect(setContainerWidth).toHaveBeenCalledTimes(1);
            expect(setContainerWidth).toHaveBeenCalledWith(414);
        });
    });

    describe('structure', () => {
        it('passes an explicit style to GestureHandlerRootView so it cannot fall back to flex: 1', async () => {
            // Regression: with no style, GestureHandlerRootView defaults to flex: 1,
            // which collapses to zero height inside the auto-height outer View
            const { getByTestId } = await render(
                <Slider>
                    <Text>child</Text>
                </Slider>
            );

            const style = StyleSheet.flatten(getByTestId('gesture-root').props.style);
            expect(style).toEqual({ width: '100%' });
        });

        it('renders children inside the gesture root', async () => {
            const { getByTestId, getByText } = await render(
                <Slider>
                    <Text>child</Text>
                </Slider>
            );

            expect(getByTestId('gesture-root')).toBeTruthy();
            expect(getByText('child')).toBeTruthy();
        });
    });
});
