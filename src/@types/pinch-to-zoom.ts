import type { SharedValue } from 'react-native-reanimated';

export type PinchToZoomStatus = {
    scale: SharedValue<number>;
    translation: {
        x: SharedValue<number>;
        y: SharedValue<number>;
    };
};
