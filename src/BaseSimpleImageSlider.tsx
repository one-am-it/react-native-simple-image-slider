import React, {
    forwardRef,
    type ReactElement,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { FlashList, type ListRenderItemInfo } from '@shopify/flash-list';
import mergeRefs from 'merge-refs';
import { Image, type ImageProps } from 'expo-image';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';
import type ViewToken from '@shopify/flash-list/src/viewability/ViewToken';
import styled from 'styled-components/native';
import PageCounter from './PageCounter';
import PinchToZoom, { type PinchToZoomProps } from './PinchToZoom';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import renderProp, { type RenderProp } from './utils/renderProp';

export type SimpleImageSliderItem = ImageProps & {
    key: string;
};

export type BaseSimpleImageSliderProps = {
    data: SimpleImageSliderItem[];
    style?: StyleProp<ViewStyle>;
    imageWidth?: number;
    imageHeight?: number;
    imageAspectRatio?: number;
    onItemPress?: (item: SimpleImageSliderItem, index: number) => void;
    maxPreviewItems?: number;
    showPageCounter?: boolean;
    pageCounterPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    renderPageCounter?: (currentPage: number, totalPages: number) => ReactElement;
    TopRightComponent?: RenderProp;
    TopLeftComponent?: RenderProp;
    BottomRightComponent?: RenderProp;
    BottomLeftComponent?: RenderProp;
    indexOverride?: number;
    onViewableItemChange?: (index: number) => void;
    enablePinchToZoom?: boolean;
    onPinchToZoomStatusChange?: PinchToZoomProps['onTranslationChange'];
    onPinchToZoomRequestClose?: PinchToZoomProps['onRequestClose'];
};

const StyledAbsoluteComponentContainer = styled.View<{
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}>`
    z-index: 1000;
    position: absolute;
    bottom: ${({ position, theme }) =>
        position === 'bottom-left' || position === 'bottom-right'
            ? `${theme.styles.spacing.m}px`
            : undefined};
    top: ${({ position, theme }) =>
        position === 'top-left' || position === 'top-right'
            ? `${theme.styles.spacing.m}px`
            : undefined};
    left: ${({ position, theme }) =>
        position === 'top-left' || position === 'bottom-left'
            ? `${theme.styles.spacing.m}px`
            : undefined};
    right: ${({ position, theme }) =>
        position === 'top-right' || position === 'bottom-right'
            ? `${theme.styles.spacing.m}px`
            : undefined};
`;

const StyledPageCounter = styled(PageCounter)<{
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}>`
    z-index: 1000;
    position: absolute;
    bottom: ${({ position, theme }) =>
        position === 'bottom-left' || position === 'bottom-right'
            ? `${theme.styles.spacing.m}px`
            : undefined};
    top: ${({ position, theme }) =>
        position === 'top-left' || position === 'top-right'
            ? `${theme.styles.spacing.m}px`
            : undefined};
    left: ${({ position, theme }) =>
        position === 'top-left' || position === 'bottom-left'
            ? `${theme.styles.spacing.m}px`
            : undefined};
    right: ${({ position, theme }) =>
        position === 'top-right' || position === 'bottom-right'
            ? `${theme.styles.spacing.m}px`
            : undefined};
`;

const StyledContainer = styled(GestureHandlerRootView)<{ aspectRatio?: number }>`
    aspect-ratio: ${({ aspectRatio }) => aspectRatio ?? 4 / 3};
    width: 100%;
`;

const StyledImage = styled(Image)<
    ImageProps & {
        imageWidth?: number;
        imageHeight?: number;
        imageAspectRatio?: number;
    }
>`
    width: ${({ imageWidth }) => (imageWidth ? `${imageWidth}px` : '100%')};
    height: ${({ imageHeight }) => (imageHeight ? `${imageHeight}px` : '100%')};
    aspect-ratio: ${({ imageAspectRatio }) => (imageAspectRatio ? imageAspectRatio : 4 / 3)};
`;

const StyledPinchToZoom = styled(PinchToZoom)`
    z-index: 1000;
`;

const BaseListImageSlider = forwardRef<
    FlashList<SimpleImageSliderItem>,
    BaseSimpleImageSliderProps
>(function BaseListImageSlider(
    {
        data,
        style,
        imageWidth,
        imageHeight,
        imageAspectRatio,
        onItemPress,
        maxPreviewItems,
        showPageCounter = true,
        pageCounterPosition = 'bottom-left',
        renderPageCounter,
        TopRightComponent,
        TopLeftComponent,
        BottomRightComponent,
        BottomLeftComponent,
        indexOverride,
        onViewableItemChange,
        enablePinchToZoom = false,
        onPinchToZoomStatusChange,
        onPinchToZoomRequestClose,
    },
    ref
) {
    const listRef = useRef<FlashList<SimpleImageSliderItem>>(null);
    const [currentItem, setCurrentItem] = useState(0);

    const slicedData = useMemo(
        () => (maxPreviewItems !== undefined ? data?.slice(0, maxPreviewItems) ?? [] : data ?? []),
        [data, maxPreviewItems]
    );

    useEffect(() => {
        setCurrentItem(indexOverride ?? 0);

        listRef.current?.scrollToIndex({ index: indexOverride ?? 0, animated: false });
    }, [indexOverride, slicedData]);

    const keyExtractor = useCallback((item: SimpleImageSliderItem) => item.key, []);

    const renderItem = useCallback(
        ({ item, index }: ListRenderItemInfo<SimpleImageSliderItem>) => {
            return (
                <Pressable onPress={() => onItemPress?.(item, index)}>
                    <StyledImage
                        transition={200}
                        placeholder={item.placeholder}
                        placeholderContentFit={'cover'}
                        imageWidth={imageWidth}
                        imageHeight={imageHeight}
                        imageAspectRatio={imageAspectRatio}
                        recyclingKey={item.key}
                        source={item.source}
                        contentFit={'cover'}
                        contentPosition={'center'}
                    />
                </Pressable>
            );
        },
        [imageAspectRatio, imageHeight, imageWidth, onItemPress]
    );

    const onViewableItemsChanged = useCallback(
        ({ viewableItems }: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
            const newIndex = viewableItems[0]?.index;
            if (newIndex !== undefined && newIndex !== null) {
                setCurrentItem(newIndex);
                onViewableItemChange?.(newIndex);
            }
        },
        [onViewableItemChange]
    );

    const [scrollEnabled, setScrollEnabled] = useState(true);

    const onScaleChange = useCallback(() => {
        setScrollEnabled(false);
    }, []);

    const onScaleReset = useCallback(() => {
        setScrollEnabled(true);
    }, []);

    const list = (
        <FlashList
            renderScrollComponent={ScrollView}
            scrollEnabled={scrollEnabled}
            disableScrollViewPanResponder={enablePinchToZoom ? !scrollEnabled : false}
            ref={mergeRefs(ref, listRef)}
            initialScrollIndex={indexOverride ?? currentItem ?? 0}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{
                itemVisiblePercentThreshold: 55,
            }}
            decelerationRate={'fast'}
            pagingEnabled={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            horizontal={true}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            data={slicedData}
            estimatedItemSize={
                imageWidth ?? (imageHeight ? imageHeight * (imageAspectRatio ?? 4 / 3) : 350)
            }
        />
    );

    return (
        <StyledContainer aspectRatio={imageAspectRatio} style={style}>
            {enablePinchToZoom ? (
                <StyledPinchToZoom
                    onRequestClose={onPinchToZoomRequestClose}
                    onTranslationChange={onPinchToZoomStatusChange}
                    onScaleChange={onScaleChange}
                    onScaleReset={onScaleReset}
                    maximumZoomScale={5}
                    minimumZoomScale={1}
                >
                    {list}
                </StyledPinchToZoom>
            ) : (
                list
            )}
            {showPageCounter ? (
                renderPageCounter ? (
                    renderPageCounter(currentItem + 1, slicedData.length)
                ) : (
                    <StyledPageCounter
                        position={pageCounterPosition}
                        totalPages={slicedData.length}
                        currentPage={currentItem + 1}
                    />
                )
            ) : null}
            {TopRightComponent ? (
                <StyledAbsoluteComponentContainer position={'top-right'}>
                    {renderProp(TopRightComponent)}
                </StyledAbsoluteComponentContainer>
            ) : null}
            {TopLeftComponent ? (
                <StyledAbsoluteComponentContainer position={'top-left'}>
                    {renderProp(TopLeftComponent)}
                </StyledAbsoluteComponentContainer>
            ) : null}
            {BottomRightComponent ? (
                <StyledAbsoluteComponentContainer position={'bottom-right'}>
                    {renderProp(BottomRightComponent)}
                </StyledAbsoluteComponentContainer>
            ) : null}
            {BottomLeftComponent ? (
                <StyledAbsoluteComponentContainer position={'bottom-left'}>
                    {renderProp(BottomLeftComponent)}
                </StyledAbsoluteComponentContainer>
            ) : null}
        </StyledContainer>
    );
});

export default BaseListImageSlider;
