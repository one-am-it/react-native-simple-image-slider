import React, {
    forwardRef,
    type ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { Modal, type ScaledSize, StyleSheet, useWindowDimensions } from 'react-native';
import IconX from './icons/IconX';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { setStatusBarStyle } from 'expo-status-bar';
import styled, { type DefaultTheme, useTheme } from 'styled-components/native';
import { FlashList } from '@shopify/flash-list';
import BaseListImageSlider, { type BaseSimpleImageSliderProps } from './BaseSimpleImageSlider';
import { type EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { PinchToZoomStatus } from './@types/pinch-to-zoom';
import type { SimpleImageSliderItem } from './@types/slider';
import renderProp, { type RenderProp } from './utils/renderProp';

export type FullScreenImageSliderProps = BaseSimpleImageSliderProps & {
    open?: boolean;
    onRequestClose?: () => void;
    renderDescription?: (item: SimpleImageSliderItem, index: number) => ReactNode;
    CloseButtonIcon?: RenderProp;
};

const StyledDescriptionContainer = styled.View`
    position: absolute;
    border-top-width: 1px;
    border-top-color: ${({ theme }) => theme.colors.descriptionContainerBorder};
    width: 100%;
    padding-top: ${({ theme }) => theme.styles.spacing.l}px;
`;

const StyledModalCloseButton = styled.TouchableOpacity`
    position: absolute;
    z-index: 1000;
`;

const StyledModalContentContainer = styled(Animated.View)`
    align-items: center;
    justify-content: center;
    gap: ${({ theme }) => theme.styles.spacing.m}px;
`;

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
        data,
        ...props
    },
    ref
) {
    const windowDimensions = useWindowDimensions();
    const theme = useTheme();
    const safeAreaInsets = useSafeAreaInsets();
    const styles = useMemo(
        () => makeStyles(theme, safeAreaInsets, windowDimensions),
        [theme, safeAreaInsets, windowDimensions]
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
            if (scale.value <= 1) {
                if (translation.x.value === 0 && translation.y.value === 0) {
                    runOnJS(setStatusBarStyle)('light');
                    backgroundOpacity.value = withTiming(1);
                } else {
                    runOnJS(setStatusBarStyle)('dark');
                    backgroundOpacity.value = withTiming(0);
                }
            } else {
                backgroundOpacity.value = 1;
            }
        },
        [backgroundOpacity]
    );

    return (
        <Modal
            animationType="fade"
            onRequestClose={onRequestClose}
            transparent={true}
            visible={open}
        >
            <StyledModalContentContainer style={[styles.modalContent, modalContentStyle]}>
                <StyledModalCloseButton style={styles.closeButton} onPress={onRequestClose}>
                    {CloseButtonIcon ? (
                        renderProp(CloseButtonIcon)
                    ) : (
                        <IconX color={theme.colors.fullScreenCloseButton} />
                    )}
                </StyledModalCloseButton>
                <BaseListImageSlider
                    data={data}
                    enablePinchToZoom={true}
                    onPinchToZoomStatusChange={onPinchToZoomStatusChange}
                    onPinchToZoomRequestClose={onRequestClose}
                    {...props}
                    onViewableItemChange={internalOnViewableItemChange}
                    showPageCounter={false}
                    imageWidth={windowDimensions.width}
                    ref={ref}
                />

                {renderDescription && data[internalIndex] ? (
                    <StyledDescriptionContainer style={styles.descriptionContainer}>
                        {renderDescription(
                            data[internalIndex] as SimpleImageSliderItem,
                            internalIndex
                        )}
                    </StyledDescriptionContainer>
                ) : null}
            </StyledModalContentContainer>
        </Modal>
    );
});

export default FullScreenImageSlider;

const makeStyles = (
    theme: DefaultTheme,
    safeAreaInsets: EdgeInsets,
    windowDimensions: ScaledSize
) => {
    return StyleSheet.create({
        closeButton: {
            top: safeAreaInsets.top,
            right: safeAreaInsets.right + theme.styles.spacing.l,
        },
        modalContent: {
            height: windowDimensions.height,
            width: windowDimensions.width,
        },
        descriptionContainer: {
            bottom: safeAreaInsets.bottom + 100,
            paddingLeft: safeAreaInsets.left + theme.styles.spacing.l,
            paddingRight: safeAreaInsets.right + theme.styles.spacing.l,
        },
    });
};
