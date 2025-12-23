import React, { useCallback, useEffect, useMemo } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Modal, StyleSheet, useColorScheme, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { setStatusBarStyle } from 'expo-status-bar';
import { useSliderContext } from '../context/slider-context';
import type { PinchToZoomStatus } from '../types';
import { SliderFullScreenProvider } from '../context/slider-full-screen-context';

type SliderFullScreenProps = {
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
};

function SliderFullScreen({ children, style }: SliderFullScreenProps) {
    const {
        isFullScreenOpen,
        registerFullScreen,
        closeFullScreen,
        scrollToIndex,
        registerOnIndexChange,
        registerOnPinchStatusChange,
        registerOnPinchDismiss,
        registerOnFullScreenChange,
        statusBarStyle,
    } = useSliderContext();

    const windowDimensions = useWindowDimensions();
    const colorScheme = useColorScheme();

    const styles = useMemo(
        () =>
            StyleSheet.create({
                modalContent: {
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 16,
                    height: windowDimensions.height,
                    width: windowDimensions.width,
                },
                contentContainer: {
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                },
            }),
        [windowDimensions]
    );

    const backgroundOpacity = useSharedValue(1);

    const modalContentStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: `rgba(0, 0, 0, ${backgroundOpacity.value})`,
        };
    }, []);

    const handleClose = useCallback(() => {
        closeFullScreen();
    }, [closeFullScreen]);

    const handlePinchStatusChange = useCallback(
        (status: PinchToZoomStatus) => {
            if (status.scale <= 1) {
                const maxTranslationY = windowDimensions.height / 2;
                const progress = Math.min(Math.abs(status.translation.y) / maxTranslationY, 1);
                backgroundOpacity.value = 1 - progress * 0.8;
            } else {
                backgroundOpacity.value = 1;
            }
        },
        [windowDimensions.height, backgroundOpacity]
    );

    const handleFullScreenChange = useCallback(
        (isFullScreen: boolean) => {
            if (isFullScreen) {
                setStatusBarStyle('light');
            } else {
                if (statusBarStyle === 'auto') {
                    setStatusBarStyle(colorScheme === 'dark' ? 'light' : 'dark');
                } else {
                    setStatusBarStyle(statusBarStyle);
                }
            }
        },
        [colorScheme, statusBarStyle]
    );

    const handleIndexChange = useCallback(
        (index: number) => {
            scrollToIndex(index, false);
        },
        [scrollToIndex]
    );

    useEffect(() => {
        return registerOnIndexChange(handleIndexChange);
    }, [handleIndexChange, registerOnIndexChange]);

    useEffect(() => {
        return registerOnFullScreenChange(handleFullScreenChange);
    }, [handleFullScreenChange, registerOnFullScreenChange]);

    useEffect(() => {
        return registerOnPinchStatusChange(handlePinchStatusChange);
    }, [handlePinchStatusChange, registerOnPinchStatusChange]);

    useEffect(() => {
        return registerOnPinchDismiss(handleClose);
    }, [handleClose, registerOnPinchDismiss]);

    useEffect(() => {
        return registerFullScreen();
    }, [registerFullScreen]);

    return (
        <Modal
            animationType="fade"
            onRequestClose={handleClose}
            transparent={true}
            visible={isFullScreenOpen}
        >
            <Animated.View style={[styles.modalContent, modalContentStyle, style]}>
                <GestureHandlerRootView style={styles.contentContainer}>
                    <SliderFullScreenProvider>{children}</SliderFullScreenProvider>
                </GestureHandlerRootView>
            </Animated.View>
        </Modal>
    );
}

export type { SliderFullScreenProps };
export { SliderFullScreen };
