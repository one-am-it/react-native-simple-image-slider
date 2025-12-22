import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, StyleSheet, useWindowDimensions } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { setStatusBarStyle } from 'expo-status-bar';
import { useSlider, SliderProvider } from '../context/slider-context';
import type { PinchToZoomStatus } from '../types/pinch-to-zoom';

type SliderFullScreenProps = {
    children?: React.ReactNode;
    enablePinchToZoom?: boolean;
    style?: StyleProp<ViewStyle>;
};

function SliderFullScreen({ children, style }: SliderFullScreenProps) {
    const {
        data,
        imageAspectRatio,
        isFullScreenOpen,
        currentIndex,
        setCurrentIndex,
        scrollToIndex,
        registerFullScreen,
        unregisterFullScreen,
        closeFullScreen,
    } = useSlider();
    const windowDimensions = useWindowDimensions();

    const [fullScreenIndex, setFullScreenIndex] = useState(currentIndex);

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

    useEffect(() => {
        if (isFullScreenOpen) {
            setFullScreenIndex(currentIndex);
        }
    }, [currentIndex, isFullScreenOpen]);

    useEffect(() => {
        if (isFullScreenOpen) {
            setStatusBarStyle('light');
        } else {
            setStatusBarStyle('dark');
        }
    }, [isFullScreenOpen]);

    useEffect(() => {
        registerFullScreen();
        return () => {
            unregisterFullScreen();
        };
    }, [registerFullScreen, unregisterFullScreen]);

    const backgroundOpacity = useSharedValue(1);

    const modalContentStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: `rgba(0, 0, 0, ${backgroundOpacity.value})`,
        };
    }, []);

    const handleClose = useCallback(() => {
        setCurrentIndex(fullScreenIndex);
        scrollToIndex(fullScreenIndex, false);
        closeFullScreen();
    }, [closeFullScreen, fullScreenIndex, scrollToIndex, setCurrentIndex]);

    const handleIndexChange = useCallback(
        (index: number) => {
            setFullScreenIndex(index);
            setCurrentIndex(index);
            scrollToIndex(index, false);
        },
        [scrollToIndex, setCurrentIndex]
    );

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

    return (
        <Modal
            animationType="fade"
            onRequestClose={handleClose}
            transparent={true}
            visible={isFullScreenOpen}
        >
            <Animated.View style={[styles.modalContent, modalContentStyle, style]}>
                <SliderProvider
                    data={data}
                    initialIndex={fullScreenIndex}
                    imageAspectRatio={imageAspectRatio}
                    onIndexChange={handleIndexChange}
                    onFullScreenChange={closeFullScreen}
                    onPinchStatusChange={handlePinchStatusChange}
                    onPinchDismiss={handleClose}
                >
                    <GestureHandlerRootView style={styles.contentContainer}>
                        {children}
                    </GestureHandlerRootView>
                </SliderProvider>
            </Animated.View>
        </Modal>
    );
}

export type { SliderFullScreenProps };
export { SliderFullScreen };
