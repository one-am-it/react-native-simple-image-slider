import React, {
    forwardRef,
    type ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { Modal, type ScaledSize, StyleSheet, useWindowDimensions } from 'react-native';
import { IconX } from 'tabler-icons-react-native';
import Animated, {
    runOnJS,
    type SharedValue,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { setStatusBarStyle } from 'expo-status-bar';
import styled, { type DefaultTheme, useTheme } from 'styled-components/native';
import { FlashList } from '@shopify/flash-list';
import BaseListImageSlider, {
    type BaseSimpleImageSliderProps,
    type SimpleImageSliderItem,
} from './BaseSimpleImageSlider';
import { type EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';

export type FullScreenImageSliderProps = BaseSimpleImageSliderProps & {
    open?: boolean;
    onRequestClose?: () => void;
    renderDescription?: (index: number) => ReactNode;
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
    { open, onRequestClose, renderDescription, onViewableItemChange, ...props },
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

    const onPinchToZoomTranslationChange = useCallback(
        (x: SharedValue<number>, y: SharedValue<number>, scale: SharedValue<number>) => {
            if (scale.value <= 1) {
                if (x.value === 0 && y.value === 0) {
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
                    <IconX color={theme.colors.fullScreenCloseButton} />
                </StyledModalCloseButton>
                <BaseListImageSlider
                    enablePinchToZoom={true}
                    onPinchToZoomTranslationChange={onPinchToZoomTranslationChange}
                    onPinchToZoomRequestClose={onRequestClose}
                    {...props}
                    onViewableItemChange={internalOnViewableItemChange}
                    showPageCounter={false}
                    imageWidth={windowDimensions.width}
                    ref={ref}
                />

                {renderDescription ? (
                    <StyledDescriptionContainer style={styles.descriptionContainer}>
                        {renderDescription(internalIndex)}
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
