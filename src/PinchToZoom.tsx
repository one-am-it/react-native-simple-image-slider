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
    useAnimatedReaction,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { clamp } from './utils/clamp';
import * as Haptics from 'expo-haptics';
import type { PinchToZoomStatus } from './@types/pinch-to-zoom';

export type PinchToZoomProps = PropsWithChildren<{
    /**
     * @description The minimum zoom scale of the image.
     * @default 1
     */
    minimumZoomScale?: number;
    /**
     * @description The maximum zoom scale of the image.
     * @default 8
     */
    maximumZoomScale?: number;
    /**
     * @description Additional styles or styles to override default style of the container View.
     */
    style?: StyleProp<ViewStyle>;
    /**
     * @description Whether all gestures should be disabled or not.
     * @default false
     */
    disabled?: boolean;
    /**
     * @description Callback that is called when the layout of the container changes.
     * @param {LayoutChangeEvent} e The layout change event.
     */
    onLayout?: (e: LayoutChangeEvent) => void;
    /**
     * @description Callback that is called when the scale of the image changes to a value different from `minimumZoomScale`.
     */
    onScaleChange?: () => void;
    /**
     * @description Callback that is called when the scale of the image changes to `minimumZoomScale`.
     */
    onScaleReset?: () => void;
    /**
     * @description Callback that is called when either the translation or the scale of the image change.
     * @param {PinchToZoomStatus} status The current status.
     */
    onStatusChange?: (status: PinchToZoomStatus) => void;
    /**
     * @description Callback that is called when gestures should lead to the item being dismissed.
     */
    onDismiss?: () => void;
}>;

export default function PinchToZoom({
    minimumZoomScale = 1,
    maximumZoomScale = 8,
    style: propStyle,
    disabled,
    onLayout,
    onStatusChange,
    onScaleChange,
    onScaleReset,
    children,
    onDismiss,
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
                        if (onDismiss) {
                            runOnJS(onDismiss)();
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
                }),

        [
            disabled,
            translationX,
            translationY,
            scale,
            prevScale,
            offsetScale,
            onScaleChange,
            maximumZoomScale,
            isPinching,
            originX,
            originY,
            prevTranslationX,
            prevTranslationY,
            viewWidth,
            viewHeight,
            minimumZoomScale,
            onDismiss,
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
                            if (onDismiss) {
                                runOnJS(onDismiss)();
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
            onDismiss,
            prevScale,
            prevTranslationX,
            prevTranslationY,
            scale,
            windowHeight,
            translationX,
            translationY,
            viewHeight,
            viewWidth,
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
                translation: {
                    x: translationX.value,
                    y: translationY.value,
                },
            };
        },
        (prepared) => {
            if (onStatusChange) {
                runOnJS(onStatusChange)(prepared);
            }
        },
        [onStatusChange]
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
