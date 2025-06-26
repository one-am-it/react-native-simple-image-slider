import React, {
    forwardRef,
    type ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import {
    Modal,
    type ScaledSize,
    StyleSheet,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';
import IconX from './icons/IconX';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { setStatusBarStyle } from 'expo-status-bar';
import { FlashList } from '@shopify/flash-list';
import BaseListImageSlider, { type BaseSimpleImageSliderProps } from './BaseSimpleImageSlider';
import { type EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { PinchToZoomStatus } from './@types/pinch-to-zoom';
import type { SimpleImageSliderItem } from './@types/slider';
import renderProp, { type RenderProp } from './utils/renderProp';
import {
    type SimpleImageSliderTheme,
    useSimpleImageSliderTheme,
} from './SimpleImageSliderThemeProvider';

export type FullScreenImageSliderProps = Omit<BaseSimpleImageSliderProps, 'imageWidth'> & {
    /**
     * @description Whether the modal is open or not.
     */
    open?: boolean;
    /**
     * @description Callback that is called when the modal is requested to be closed.
     */
    onRequestClose?: () => void;
    /**
     * @description Callback that renders an element to be displayed as the description of the current image.
     * @param item The current item being displayed.
     * @param index The index of the current item being displayed.
     */
    renderDescription?: (item: SimpleImageSliderItem, index: number) => ReactNode;
    /**
     * @description Item to be rendered in place of the default close button icon.
     */
    CloseButtonIcon?: RenderProp;
    /**
     * @description Callback that is called when the modal begins to fade out.
     */
    onFadeOut?: () => void;
};

/**
 * @description A full screen image slider that displays images in a modal.
 */
const FullScreenImageSlider = forwardRef<
    FlashList<SimpleImageSliderItem>,
    FullScreenImageSliderProps
>(function FullScreenImageSlider(
    {
        CloseButtonIcon,
        open,
        onRequestClose,
        renderDescription,
        onViewableItemChange,
        onFadeOut,
        data,
        ...props
    },
    ref
) {
    const windowDimensions = useWindowDimensions();
    const theme = useSimpleImageSliderTheme();
    const safeAreaInsets = useSafeAreaInsets();
    const styles = useMemo(
        () => makeStyles(safeAreaInsets, windowDimensions, theme),
        [safeAreaInsets, windowDimensions, theme]
    );

    const [internalIndex, setInternalIndex] = useState<number>(0);

    const internalOnViewableItemChange = useCallback(
        (index: number) => {
            setInternalIndex(index);
            onViewableItemChange?.(index);
        },
        [onViewableItemChange]
    );

    useEffect(() => {
        if (open) {
            setStatusBarStyle('light');
        } else {
            setStatusBarStyle('dark');
        }
    }, [open]);

    const backgroundOpacity = useSharedValue(0);

    const modalContentStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: `rgba(0, 0, 0, ${backgroundOpacity.value})`,
        };
    }, []);

    const onPinchToZoomStatusChange = useCallback(
        ({ translation, scale }: PinchToZoomStatus) => {
            if (scale <= 1) {
                if (translation.x === 0 && translation.y === 0) {
                    runOnJS(setStatusBarStyle)('light');
                    backgroundOpacity.value = withTiming(1);
                } else {
                    if (onFadeOut) {
                        runOnJS(onFadeOut)();
                    }
                    runOnJS(setStatusBarStyle)('dark');
                    backgroundOpacity.value = withTiming(0);
                }
            } else {
                backgroundOpacity.value = 1;
            }
        },
        [backgroundOpacity, onFadeOut]
    );

    return (
        <Modal
            animationType="fade"
            onRequestClose={onRequestClose}
            transparent={true}
            visible={open}
        >
            <Animated.View style={[styles.modalContent, modalContentStyle]}>
                <TouchableOpacity style={styles.closeButton} onPress={onRequestClose}>
                    {CloseButtonIcon ? (
                        renderProp(CloseButtonIcon)
                    ) : (
                        <IconX color={theme.colors.fullScreenCloseButton} />
                    )}
                </TouchableOpacity>
                <BaseListImageSlider
                    data={data}
                    enablePinchToZoom={true}
                    onPinchToZoomStatusChange={onPinchToZoomStatusChange}
                    onPinchToZoomRequestClose={onRequestClose}
                    showPageCounter={false}
                    {...props}
                    onViewableItemChange={internalOnViewableItemChange}
                    imageWidth={windowDimensions.width}
                    ref={ref}
                />

                {renderDescription && data[internalIndex] ? (
                    <View style={styles.descriptionContainer}>
                        {renderDescription(data[internalIndex], internalIndex)}
                    </View>
                ) : null}
            </Animated.View>
        </Modal>
    );
});

export default FullScreenImageSlider;

const makeStyles = (
    safeAreaInsets: EdgeInsets,
    windowDimensions: ScaledSize,
    theme: SimpleImageSliderTheme
) => {
    return StyleSheet.create({
        closeButton: {
            position: 'absolute',
            zIndex: 1000,
            top: safeAreaInsets.top,
            right: safeAreaInsets.right + 20,
        },
        modalContent: {
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            height: windowDimensions.height,
            width: windowDimensions.width,
        },
        descriptionContainer: {
            position: 'absolute',
            borderTopWidth: 1,
            borderTopColor: theme.colors.descriptionContainerBorder,
            width: '100%',
            paddingTop: 20,
            bottom: safeAreaInsets.bottom + 100,
            paddingLeft: safeAreaInsets.left + 20,
            paddingRight: safeAreaInsets.right + 20,
        },
    });
};
