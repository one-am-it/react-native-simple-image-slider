import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { ImageProps } from 'expo-image';
import type { PinchToZoomStatus } from './pinch-to-zoom';
import type { SliderState } from './slider-state';

type SliderItem = ImageProps & {
    key: string;
};

type SliderProviderProps = {
    children: ReactNode;
    data: SliderItem[];
    initialIndex?: number;
    imageAspectRatio?: number;
    style?: StyleProp<ViewStyle>;
    statusBarStyle?: 'light' | 'dark' | 'auto';
    onIndexChange?: (index: number) => void;
    onItemPress?: (item: SliderItem, index: number) => void;
    onFullScreenChange?: (isOpen: boolean) => void;
    onSlideChange?: (index: number) => void;
    onPinchStatusChange?: (status: PinchToZoomStatus) => void;
    onPinchDismiss?: () => void;
};

type SliderContextValue = SliderState;

export type { SliderItem, SliderProviderProps, SliderContextValue };
