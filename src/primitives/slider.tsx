import React, { useCallback, useLayoutEffect, useRef } from 'react';
import type { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSliderContext } from '../context/slider-context';

type SliderProps = {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
};

function Slider({ style, children }: SliderProps) {
    const { setContainerWidth } = useSliderContext();
    const ref = useRef<View>(null);

    // On the New Architecture layout is computed during commit, so the width is
    // readable here synchronously — before the first paint, like in the browser.
    // onLayout below stays as the source of truth for later resizes.
    useLayoutEffect(() => {
        const rect = ref.current?.getBoundingClientRect?.();
        if (rect && rect.width > 0) {
            setContainerWidth(rect.width);
        }
    }, [setContainerWidth]);

    const handleLayout = useCallback(
        (e: LayoutChangeEvent) => {
            setContainerWidth(e.nativeEvent.layout.width);
        },
        [setContainerWidth]
    );

    return (
        <View ref={ref} style={[styles.container, style]} onLayout={handleLayout}>
            {/* Without an explicit style GestureHandlerRootView defaults to flex: 1,
                which collapses to zero height inside this auto-height container */}
            <GestureHandlerRootView style={styles.gestureRoot}>{children}</GestureHandlerRootView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    gestureRoot: {
        width: '100%',
    },
});

export type { SliderProps };
export { Slider };
