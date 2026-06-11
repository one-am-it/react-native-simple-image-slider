import { renderHook, act } from '@testing-library/react-native';
import { useSliderState } from '../hooks/use-slider-state';

jest.mock('expo-image', () => ({ useImage: jest.fn(() => null) }));

describe('useSliderState — containerWidth', () => {
    it('initialises containerWidth to 0', async () => {
        const { result } = await renderHook(() => useSliderState({ data: [] }));
        expect(result.current.containerWidth).toBe(0);
    });

    it('updates containerWidth when setContainerWidth is called', async () => {
        const { result } = await renderHook(() => useSliderState({ data: [] }));

        await act(async () => {
            result.current.setContainerWidth(375);
        });

        expect(result.current.containerWidth).toBe(375);
    });

    it('reflects the last width when setContainerWidth is called multiple times', async () => {
        const { result } = await renderHook(() => useSliderState({ data: [] }));

        await act(async () => {
            result.current.setContainerWidth(375);
        });

        await act(async () => {
            result.current.setContainerWidth(768);
        });

        expect(result.current.containerWidth).toBe(768);
    });
});
