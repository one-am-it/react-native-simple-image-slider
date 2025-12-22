import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { ImageProps } from 'expo-image';
import type { PinchToZoomStatus } from './pinch-to-zoom';

type SliderItem = ImageProps & {
    key: string;
};

type SliderProviderProps = {
    children: ReactNode;
    data: SliderItem[];
    initialIndex?: number;
    imageAspectRatio?: number;
    style?: StyleProp<ViewStyle>;
    onIndexChange?: (index: number) => void;
    onItemPress?: (item: SliderItem, index: number) => void;
    onFullScreenChange?: (isOpen: boolean) => void;
    onSlideChange?: (index: number) => void;
    onPinchStatusChange?: (status: PinchToZoomStatus) => void;
    onPinchDismiss?: () => void;
};

export type { SliderItem, SliderProviderProps };
export type { SliderContextValue } from './slider-state';
