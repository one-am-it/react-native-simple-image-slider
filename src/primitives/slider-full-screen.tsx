import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, StyleSheet, useWindowDimensions, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { setStatusBarStyle } from 'expo-status-bar';
import { useSlider, SliderProvider } from '../context/slider-context';

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

    const handleIndexChange = useCallback((index: number) => {
        setFullScreenIndex(index);
    }, []);

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
                >
                    <View
                        style={{ width: windowDimensions.width, height: windowDimensions.height }}
                    >
                        {children}
                    </View>
                </SliderProvider>
            </Animated.View>
        </Modal>
    );
}

export type { SliderFullScreenProps };
export { SliderFullScreen };
