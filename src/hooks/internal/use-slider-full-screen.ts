import { useCallback, useState } from 'react';
import type { SliderFullScreenState } from '../../types/slider-state';

export function useSliderFullScreen({
    onFullScreenChange,
}: {
    onFullScreenChange?: (isOpen: boolean) => void;
}): SliderFullScreenState {
    const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);
    const [hasFullScreen, setHasFullScreen] = useState(false);

    const openFullScreen = useCallback(() => {
        setIsFullScreenOpen(true);
        onFullScreenChange?.(true);
    }, [onFullScreenChange]);

    const closeFullScreen = useCallback(() => {
        setIsFullScreenOpen(false);
        onFullScreenChange?.(false);
    }, [onFullScreenChange]);

    const registerFullScreen = useCallback(() => {
        setHasFullScreen(true);
    }, []);

    const unregisterFullScreen = useCallback(() => {
        setHasFullScreen(false);
    }, []);

    return {
        isFullScreenOpen,
        openFullScreen,
        closeFullScreen,
        hasFullScreen,
        registerFullScreen,
        unregisterFullScreen,
    };
}
