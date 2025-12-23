import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

type SliderProps = {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
};

function Slider({ style, children }: SliderProps) {
    return (
        <GestureHandlerRootView style={[styles.container, style]}>
            {children}
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
});

export type { SliderProps };
export { Slider };
