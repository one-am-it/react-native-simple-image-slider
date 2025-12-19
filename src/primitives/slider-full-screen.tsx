import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, StyleSheet, useWindowDimensions, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { setStatusBarStyle } from 'expo-status-bar';
import { useSlider, SliderProvider } from '../context/slider-context';
import type { PinchToZoomStatus } from '../types/pinch-to-zoom';

type SliderFullScreenProps = {
    children?: React.ReactNode;
    enablePinchToZoom?: boolean;
    style?: StyleProp<ViewStyle>;
};

function SliderFullScreen({ children, style }: SliderFullScreenProps) {
    const parentContext = useSlider();
    const windowDimensions = useWindowDimensions();

    const [fullScreenIndex, setFullScreenIndex] = useState(parentContext.currentIndex);

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
        if (parentContext.isFullScreenOpen) {
            setFullScreenIndex(parentContext.currentIndex);
        }
    }, [parentContext.isFullScreenOpen, parentContext.currentIndex]);

    useEffect(() => {
        if (parentContext.isFullScreenOpen) {
            setStatusBarStyle('light');
        } else {
            setStatusBarStyle('dark');
        }
    }, [parentContext.isFullScreenOpen]);

    useEffect(() => {
        parentContext.registerFullScreen();
        return () => {
            parentContext.unregisterFullScreen();
        };
    }, [parentContext]);

    const backgroundOpacity = useSharedValue(1);

    const modalContentStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: `rgba(0, 0, 0, ${backgroundOpacity.value})`,
        };
    }, []);

    const handleClose = useCallback(() => {
        parentContext.setCurrentIndex(fullScreenIndex);
        parentContext.closeFullScreen();
    }, [fullScreenIndex, parentContext]);

    const handleIndexChange = useCallback(
        (index: number) => {
            setFullScreenIndex(index);
            parentContext.setCurrentIndex(index);
            parentContext.scrollToIndex(index, false);
        },
        [parentContext]
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

    if (!parentContext.isFullScreenOpen) {
        return null;
    }

    return (
        <Modal
            animationType="fade"
            onRequestClose={handleClose}
            transparent={true}
            visible={parentContext.isFullScreenOpen}
        >
            <Animated.View style={[styles.modalContent, modalContentStyle, style]}>
                <SliderProvider
                    data={parentContext.data}
                    initialIndex={fullScreenIndex}
                    imageAspectRatio={parentContext.imageAspectRatio}
                    onIndexChange={handleIndexChange}
                    onFullScreenChange={parentContext.closeFullScreen}
                    onPinchStatusChange={handlePinchStatusChange}
                    onPinchDismiss={handleClose}
                >
                    <View style={styles.contentContainer}>{children}</View>
                </SliderProvider>
            </Animated.View>
        </Modal>
    );
}

export type { SliderFullScreenProps };
export { SliderFullScreen };
