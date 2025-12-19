import React from 'react';
import { StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SliderProvider } from '../context/slider-context';
import type { SliderItem } from '../types/context';

type SliderProps = {
    children: React.ReactNode;
    data: SliderItem[];
    initialIndex?: number;
    /**
     * Optional aspect ratio override. If not provided, aspect ratio will be
     * auto-detected from the first image. Falls back to 4:3 if detection fails.
     */
    imageAspectRatio?: number;
    style?: StyleProp<ViewStyle>;
    onIndexChange?: (index: number) => void;
    onItemPress?: (item: SliderItem, index: number) => void;
    onFullScreenChange?: (isOpen: boolean) => void;
};

function Slider({ style, children, ...props }: SliderProps) {
    return (
        <SliderProvider {...props}>
            <GestureHandlerRootView style={[styles.container, style]}>
                {children}
            </GestureHandlerRootView>
        </SliderProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
});

export type { SliderProps };
export { Slider };
