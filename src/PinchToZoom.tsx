import React, { type PropsWithChildren, useCallback, useMemo } from 'react';
import {
    type LayoutChangeEvent,
    type StyleProp,
    useWindowDimensions,
    type ViewStyle,
} from 'react-native';
import Animated, {
    cancelAnimation,
    runOnJS,
    type SharedValue,
    useAnimatedReaction,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { clamp } from './utils/clamp';
import * as Haptics from 'expo-haptics';

export type PinchToZoomProps = PropsWithChildren<{
    minimumZoomScale?: number;
    maximumZoomScale?: number;
    style?: StyleProp<ViewStyle>;
    onPinchStart?: () => void;
    onPinchEnd?: () => void;
    disabled?: boolean;
    onLayout?: (e: LayoutChangeEvent) => void;
    onScaleChange?: () => void;
    onScaleReset?: () => void;
    onTranslationChange?: (
        x: SharedValue<number>,
        y: SharedValue<number>,
        scale: SharedValue<number>
    ) => void;
    onRequestClose?: () => void;
}>;

export default function PinchToZoom({
    minimumZoomScale = 1,
    maximumZoomScale = 8,
    style: propStyle,
    onPinchStart,
    onPinchEnd,
    disabled,
    onLayout,
    onTranslationChange,
    onScaleChange,
    onScaleReset,
    children,
    onRequestClose,
}: PinchToZoomProps) {
    const { height: windowHeight } = useWindowDimensions();

    const translationX = useSharedValue(0);
    const translationY = useSharedValue(0);
    const originX = useSharedValue(0);
    const originY = useSharedValue(0);
    const scale = useSharedValue(1);
    const isPinching = useSharedValue(false);
    const viewHeight = useSharedValue(0);
    const viewWidth = useSharedValue(0);

    const prevScale = useSharedValue(0);
    const offsetScale = useSharedValue(0);
    const prevTranslationX = useSharedValue(0);
    const prevTranslationY = useSharedValue(0);

    const pinchGesture = useMemo(
        () =>
            Gesture.Pinch()
                .enabled(!disabled)
                .onStart(() => {
                    cancelAnimation(translationX);
                    cancelAnimation(translationY);
                    cancelAnimation(scale);
                    prevScale.value = scale.value;
                    offsetScale.value = scale.value;
                    if (onPinchStart) runOnJS(onPinchStart)();
                    if (onScaleChange) runOnJS(onScaleChange)();
                })
                .onUpdate((e) => {
                    if (e.numberOfPointers === 2) {
                        scale.value = Math.min(prevScale.value * e.scale, maximumZoomScale);

                        // reset the origin
                        if (!isPinching.value) {
                            isPinching.value = true;
                            originX.value = e.focalX;
                            originY.value = e.focalY;
                            prevTranslationX.value = translationX.value;
                            prevTranslationY.value = translationY.value;
                            offsetScale.value = scale.value;
                        }

                        if (isPinching.value) {
                            // translate the image to the focal point as we're zooming
                            translationX.value = clamp(
                                prevTranslationX.value +
                                    -1 *
                                        ((scale.value - offsetScale.value) *
                                            (originX.value - viewWidth.value / 2)),
                                (-viewWidth.value * (scale.value - minimumZoomScale)) / 2,
                                (viewWidth.value * (scale.value - minimumZoomScale)) / 2
                            );
                            translationY.value = clamp(
                                prevTranslationY.value +
                                    -1 *
                                        ((scale.value - offsetScale.value) *
                                            (originY.value - viewHeight.value / 2)),
                                (-viewHeight.value * (scale.value - minimumZoomScale)) / 2,
                                (viewHeight.value * (scale.value - minimumZoomScale)) / 2
                            );
                        }
                    }
                })
                .onEnd(() => {
                    isPinching.value = false;

                    if (scale.value < minimumZoomScale / 2 && prevScale.value <= minimumZoomScale) {
                        if (onRequestClose) {
                            runOnJS(onRequestClose)();
                        }
                    } else if (scale.value < minimumZoomScale) {
                        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
                        translationX.value = withTiming(0);
                        translationY.value = withTiming(0);
                        scale.value = withTiming(minimumZoomScale);
                        if (onScaleReset) {
                            runOnJS(onScaleReset)();
                        }
                    }

                    prevScale.value = 0;
                    prevTranslationX.value = translationX.value;
                    prevTranslationY.value = translationY.value;

                    if (onPinchEnd) runOnJS(onPinchEnd)();
                }),

        [
            disabled,
            translationX,
            translationY,
            scale,
            prevScale,
            offsetScale,
            onPinchStart,
            onScaleChange,
            maximumZoomScale,
            isPinching,
            originX,
            originY,
            prevTranslationX,
            prevTranslationY,
            viewWidth.value,
            viewHeight.value,
            minimumZoomScale,
            onPinchEnd,
            onRequestClose,
            onScaleReset,
        ]
    );

    const panGesture = useMemo(
        () =>
            Gesture.Pan()
                .enabled(!disabled)
                .onStart(() => {
                    cancelAnimation(translationX);
                    cancelAnimation(translationY);

                    prevTranslationX.value = translationX.value;
                    prevTranslationY.value = translationY.value;
                })
                .onUpdate((e) => {
                    if (prevScale.value <= minimumZoomScale) {
                        translationX.value = prevTranslationX.value + e.translationX;
                        translationY.value = prevTranslationY.value + e.translationY;
                    } else {
                        translationX.value = clamp(
                            prevTranslationX.value + e.translationX,
                            (-viewWidth.value * (scale.value - minimumZoomScale)) / 2,
                            (viewWidth.value * (scale.value - minimumZoomScale)) / 2
                        );
                        translationY.value = clamp(
                            prevTranslationY.value + e.translationY,
                            (-viewHeight.value * (scale.value - minimumZoomScale)) / 2,
                            (viewHeight.value * (scale.value - minimumZoomScale)) / 2
                        );
                    }
                })
                .onEnd(() => {
                    if (scale.value <= minimumZoomScale && prevScale.value <= minimumZoomScale) {
                        if (
                            Math.abs(translationX.value) > viewWidth.value / 2 ||
                            Math.abs(translationY.value) > viewHeight.value / 2
                        ) {
                            if (onRequestClose) {
                                runOnJS(onRequestClose)();
                            }
                        } else {
                            runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
                            translationX.value = withTiming(0);
                            translationY.value = withTiming(0);
                        }
                    } else if (
                        viewHeight.value * (scale.value - minimumZoomScale) <=
                        windowHeight
                    ) {
                        translationX.value = withTiming(
                            clamp(
                                translationX.value,
                                (-viewWidth.value * (scale.value - minimumZoomScale)) / 2,
                                (viewWidth.value * (scale.value - minimumZoomScale)) / 2
                            )
                        );
                        translationY.value = withTiming(
                            clamp(
                                translationY.value,
                                (-viewHeight.value * (scale.value - minimumZoomScale)) / 2,
                                (viewHeight.value * (scale.value - minimumZoomScale)) / 2
                            )
                        );
                    }
                }),
        [
            disabled,
            minimumZoomScale,
            onRequestClose,
            prevScale.value,
            prevTranslationX,
            prevTranslationY,
            scale.value,
            windowHeight,
            translationX,
            translationY,
            viewHeight.value,
            viewWidth.value,
        ]
    );

    const tapGesture = useMemo(
        () =>
            Gesture.Tap()
                .enabled(!disabled)
                .numberOfTaps(2)
                .onStart(() => {
                    if (scale.value > minimumZoomScale) {
                        translationX.value = withTiming(0);
                        translationY.value = withTiming(0);
                        scale.value = withTiming(minimumZoomScale);
                        if (onScaleReset) {
                            runOnJS(onScaleReset)();
                        }
                    } else {
                        scale.value = withTiming(maximumZoomScale / 2);
                        if (onScaleChange) {
                            runOnJS(onScaleChange)();
                        }
                    }
                }),
        [
            disabled,
            maximumZoomScale,
            minimumZoomScale,
            onScaleChange,
            onScaleReset,
            scale,
            translationX,
            translationY,
        ]
    );

    const compositeGesture = useMemo(() => {
        return Gesture.Exclusive(Gesture.Simultaneous(pinchGesture, panGesture), tapGesture);
    }, [panGesture, pinchGesture, tapGesture]);

    useAnimatedReaction(
        () => {
            return {
                scale: scale.value,
                translationX: translationX.value,
                translationY: translationY.value,
            };
        },
        () => {
            if (onTranslationChange) {
                runOnJS(onTranslationChange)(translationX, translationY, scale);
            }
        },
        [onTranslationChange]
    );

    const style = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translationX.value },
                { translateY: translationY.value },
                { scale: scale.value },
            ],
        };
    }, []);

    const internalOnLayout = useCallback(
        (e: LayoutChangeEvent) => {
            viewHeight.value = e.nativeEvent.layout.height;
            viewWidth.value = e.nativeEvent.layout.width;
            onLayout?.(e);
        },
        [viewHeight, viewWidth, onLayout]
    );

    const finalStyle = useMemo(() => [style, propStyle], [style, propStyle]);

    return (
        <GestureDetector gesture={compositeGesture}>
            <Animated.View onLayout={internalOnLayout} style={finalStyle}>
                {children}
            </Animated.View>
        </GestureDetector>
    );
}
