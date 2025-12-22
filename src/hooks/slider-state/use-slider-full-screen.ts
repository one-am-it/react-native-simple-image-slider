import { useCallback, useState } from 'react';

function useSliderFullScreen() {
    const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);
    const [hasFullScreen, setHasFullScreen] = useState(false);

    const registerFullScreen = useCallback(() => {
        setHasFullScreen(true);

        return () => {
            setHasFullScreen(false);
        };
    }, []);

    return {
        isFullScreenOpen,
        setIsFullScreenOpen,
        hasFullScreen,
        registerFullScreen,
    };
}

export { useSliderFullScreen };
