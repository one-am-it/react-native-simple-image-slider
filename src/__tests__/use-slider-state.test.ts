import { renderHook, act } from '@testing-library/react-native';
import type { LayoutChangeEvent } from 'react-native';
import { useSliderState } from '../hooks/use-slider-state';

jest.mock('expo-image', () => ({ useImage: jest.fn(() => null) }));

describe('useSliderState — handleLayout', () => {
    it('initialises containerWidth to 0', async () => {
        const { result } = await renderHook(() => useSliderState({ data: [] }));
        expect(result.current.containerWidth).toBe(0);
    });

    it('updates containerWidth when handleLayout fires', async () => {
        const { result } = await renderHook(() => useSliderState({ data: [] }));

        await act(async () => {
            result.current.handleLayout({
                nativeEvent: { layout: { width: 375, height: 200, x: 0, y: 0 } },
            } as LayoutChangeEvent);
        });

        expect(result.current.containerWidth).toBe(375);
    });

    it('reflects the last layout width when handleLayout fires multiple times', async () => {
        const { result } = await renderHook(() => useSliderState({ data: [] }));

        await act(async () => {
            result.current.handleLayout({
                nativeEvent: { layout: { width: 375, height: 200, x: 0, y: 0 } },
            } as LayoutChangeEvent);
        });

        await act(async () => {
            result.current.handleLayout({
                nativeEvent: { layout: { width: 768, height: 200, x: 0, y: 0 } },
            } as LayoutChangeEvent);
        });

        expect(result.current.containerWidth).toBe(768);
    });
});
