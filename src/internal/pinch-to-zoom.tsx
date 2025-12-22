import React, { useCallback, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { useWindowDimensions } from 'react-native';
import type { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';
import Animated, {
    cancelAnimation,
    useAnimatedReaction,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { clamp } from '../utils/clamp';
import type { PinchToZoomStatus } from '../types/pinch-to-zoom';

type PinchToZoomProps = PropsWithChildren<{
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

function PinchToZoom({
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

    const isZoomedValue = useSharedValue(false);
    const [isZoomed, setIsZoomed] = useState(false);

    const pinchGesture = useMemo(() => {
        let gesture = Gesture.Pinch()
            .enabled(!disabled)
            .onStart(() => {
                'worklet';
                cancelAnimation(translationX);
                cancelAnimation(translationY);
                cancelAnimation(scale);
                prevScale.value = scale.value;
                offsetScale.value = scale.value;
                isZoomedValue.value = true;
                if (onScaleChange) scheduleOnRN(onScaleChange);
            })
            .onUpdate((e) => {
                'worklet';
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
                'worklet';
                isPinching.value = false;

                if (scale.value < minimumZoomScale / 2 && prevScale.value <= minimumZoomScale) {
                    if (onDismiss) {
                        scheduleOnRN(onDismiss);
                    }
                } else if (scale.value < minimumZoomScale) {
                    scheduleOnRN(Haptics.impactAsync, Haptics.ImpactFeedbackStyle.Light);
                    translationX.value = withTiming(0);
                    translationY.value = withTiming(0);
                    scale.value = withTiming(minimumZoomScale);
                    isZoomedValue.value = false;
                    if (onScaleReset) {
                        scheduleOnRN(onScaleReset);
                    }
                }

                prevScale.value = scale.value;
                prevTranslationX.value = translationX.value;
                prevTranslationY.value = translationY.value;
            });

        return gesture;
    }, [
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
        isZoomedValue,
    ]);

    const panGesture = useMemo(() => {
        let gesture = Gesture.Pan().enabled(!disabled);

        if (!isZoomed) {
            gesture = gesture.activeOffsetY([-20, 20]);
        }

        return gesture
            .onStart(() => {
                'worklet';
                cancelAnimation(translationX);
                cancelAnimation(translationY);

                prevTranslationX.value = translationX.value;
                prevTranslationY.value = translationY.value;
            })
            .onUpdate((e) => {
                'worklet';
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
                'worklet';
                if (scale.value <= minimumZoomScale && prevScale.value <= minimumZoomScale) {
                    if (
                        Math.abs(translationX.value) > viewWidth.value / 2 ||
                        Math.abs(translationY.value) > viewHeight.value / 2
                    ) {
                        if (onDismiss) {
                            scheduleOnRN(onDismiss);
                        }
                    } else {
                        scheduleOnRN(Haptics.impactAsync, Haptics.ImpactFeedbackStyle.Light);
                        translationX.value = withTiming(0);
                        translationY.value = withTiming(0);
                    }
                } else if (viewHeight.value * (scale.value - minimumZoomScale) <= windowHeight) {
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
            });
    }, [
        disabled,
        isZoomed,
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
    ]);

    const tapGesture = useMemo(
        () =>
            Gesture.Tap()
                .enabled(!disabled)
                .numberOfTaps(2)
                .onStart(() => {
                    'worklet';
                    if (scale.value > minimumZoomScale) {
                        translationX.value = withTiming(0);
                        translationY.value = withTiming(0);
                        scale.value = withTiming(minimumZoomScale);
                        isZoomedValue.value = false;
                        if (onScaleReset) {
                            scheduleOnRN(onScaleReset);
                        }
                    } else {
                        scale.value = withTiming(maximumZoomScale / 2);
                        isZoomedValue.value = true;
                        if (onScaleChange) {
                            scheduleOnRN(onScaleChange);
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
            isZoomedValue,
        ]
    );

    const compositeGesture = useMemo(() => {
        return Gesture.Exclusive(Gesture.Simultaneous(pinchGesture, panGesture), tapGesture);
    }, [panGesture, pinchGesture, tapGesture]);

    useAnimatedReaction(
        () => isZoomedValue.value,
        (value) => {
            scheduleOnRN(setIsZoomed, value);
        },
        []
    );

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
                scheduleOnRN(onStatusChange, prepared);
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

    return (
        <GestureDetector gesture={compositeGesture}>
            <Animated.View onLayout={internalOnLayout} style={[style, propStyle]}>
                {children}
            </Animated.View>
        </GestureDetector>
    );
}

export type { PinchToZoomProps };
export { PinchToZoom };
