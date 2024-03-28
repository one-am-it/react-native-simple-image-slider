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
import { Pressable, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import type ViewToken from '@shopify/flash-list/src/viewability/ViewToken';
import styled from 'styled-components/native';
import PageCounter, { type PageCounterProps } from './PageCounter';
import PinchToZoom, { type PinchToZoomProps } from './PinchToZoom';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import renderProp, { type RenderProp } from './utils/renderProp';
import type { SimpleImageSliderItem } from './@types/slider';
import type { PinchToZoomStatus } from './@types/pinch-to-zoom';

export type BaseSimpleImageSliderProps = {
    /**
     * @description The list of images to be displayed.
     */
    data: SimpleImageSliderItem[];
    /**
     * @description The style of the container.
     */
    style?: StyleProp<ViewStyle>;
    /**
     * @description The width of the images. If not provided, the image will take the full width of the container.
     *  Will be calculated automatically if `imageHeight` and `imageAspectRatio` are provided.
     */
    imageWidth?: number;
    /**
     * @description The height of the images. If not provided, the image will take the full height of the container.
     *  Will be calculated automatically if `imageWidth` and `imageAspectRatio` are provided.
     */
    imageHeight?: number;
    /**
     * @description The aspect ratio of the images. Will be ignored if `imageWidth` and `imageHeight` are provided.
     * @default 4 / 3
     */
    imageAspectRatio?: number;
    /**
     * @description Callback that is called when an item is pressed.
     * @param item The item that was pressed.
     * @param index The index of the item that was pressed.
     */
    onItemPress?: (item: SimpleImageSliderItem, index: number) => void;
    /**
     * @description The maximum number of items to be displayed.
     */
    maxItems?: number;
    /**
     * @description Whether the page counter should be displayed or not.
     * @default true
     */
    showPageCounter?: boolean;
    /**
     * @description The position of the page counter.
     * @default 'bottom-left'
     */
    pageCounterPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    /**
     * @description The style of the page counter.
     */
    pageCounterStyle?: StyleProp<ViewStyle>;
    /**
     * @description The style of the text of the page counter.
     */
    pageCounterTextStyle?: StyleProp<TextStyle>;
    /**
     * @description A component to be displayed in place of the default page counter.
     */
    PageCounterComponent?: React.FunctionComponent<PageCounterProps>;
    /**
     * @description Callback that renders the page counter. If provided, this will replace the default page counter.
     * @param currentPage The current page number.
     * @param totalPages The total number of pages.
     */
    renderPageCounter?: (currentPage: number, totalPages: number) => ReactElement;
    /**
     * @description A component to be displayed in the top right corner.
     */
    TopRightComponent?: RenderProp;
    /**
     * @description A component to be displayed in the top left corner.
     */
    TopLeftComponent?: RenderProp;
    /**
     * @description A component to be displayed in the bottom right corner.
     */
    BottomRightComponent?: RenderProp;
    /**
     * @description A component to be displayed in the bottom left corner.
     */
    BottomLeftComponent?: RenderProp;
    /**
     * @description The index of the item to be displayed initially.
     */
    indexOverride?: number;
    /**
     * @description Callback that is called when the viewable item changes.
     * @param index The index of the new viewable item.
     */
    onViewableItemChange?: (index: number) => void;
    /**
     * @description Whether the pinch to zoom feature is enabled or not.
     * @default false
     */
    enablePinchToZoom?: boolean;
    /**
     * @description Callback that is called when the pinch to zoom status changes.
     * @param status The new status of the pinch to zoom.
     */
    onPinchToZoomStatusChange?: PinchToZoomProps['onStatusChange'];
    /**
     * @description Callback that is called when gestures should lead to a dismissal.
     */
    onPinchToZoomRequestClose?: PinchToZoomProps['onDismiss'];
    /**
     * @description If greater than 0, items will be loaded in groups of this size.
     * @default 5
     */
    dataWindowSize?: number;
};

const StyledAbsoluteComponentContainer = styled.View<{
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}>`
    z-index: 1000;
    position: absolute;
    bottom: ${({ position }) =>
        position === 'bottom-left' || position === 'bottom-right' ? `16px` : 'auto'};
    top: ${({ position }) =>
        position === 'top-left' || position === 'top-right' ? `16px` : 'auto'};
    left: ${({ position }) =>
        position === 'top-left' || position === 'bottom-left' ? `16px` : 'auto'};
    right: ${({ position }) =>
        position === 'top-right' || position === 'bottom-right' ? `16px` : 'auto'};
`;

const StyledPageCounter = styled(PageCounter)<{
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}>`
    z-index: 1000;
    position: absolute;
    bottom: ${({ position }) =>
        position === 'bottom-left' || position === 'bottom-right' ? `16px` : 'auto'};
    top: ${({ position }) =>
        position === 'top-left' || position === 'top-right' ? `16px` : 'auto'};
    left: ${({ position }) =>
        position === 'top-left' || position === 'bottom-left' ? `16px` : 'auto'};
    right: ${({ position }) =>
        position === 'top-right' || position === 'bottom-right' ? `16px` : 'auto'};
`;

const StyledContainer = styled(GestureHandlerRootView)<{ aspectRatio: number }>`
    aspect-ratio: ${({ aspectRatio }) => aspectRatio ?? 4 / 3};
    width: 100%;
`;

const StyledImage = styled(Image)<
    ImageProps & {
        imageWidth?: number;
        imageHeight?: number;
        imageAspectRatio: number;
    }
>`
    width: ${({ imageWidth }) => (imageWidth ? `${imageWidth}px` : '100%')};
    height: ${({ imageHeight }) => (imageHeight ? `${imageHeight}px` : '100%')};
    aspect-ratio: ${({ imageAspectRatio }) => imageAspectRatio};
`;

const StyledPinchToZoom = styled(PinchToZoom)`
    z-index: 1000;
`;

/**
 * @description A simple image slider that displays a list of images. This is the component
 *  that {@link SimpleImageSlider} and {@link FullScreenImageSlider}
 *  are built upon. You should normally use one of those two components instead of this one.
 */
const BaseSimpleImageSlider = forwardRef<
    FlashList<SimpleImageSliderItem>,
    BaseSimpleImageSliderProps
>(function BaseSimpleImageSlider(
    {
        data,
        style,
        imageWidth,
        imageHeight,
        imageAspectRatio = 4 / 3,
        onItemPress,
        maxItems,
        showPageCounter = true,
        pageCounterPosition = 'bottom-left',
        pageCounterStyle,
        pageCounterTextStyle,
        PageCounterComponent,
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
        dataWindowSize = 5,
    },
    ref
) {
    if (renderPageCounter !== undefined && PageCounterComponent !== undefined) {
        throw new Error(
            'You should provide either `renderPageCounter` or `PageCounterComponent`, not both.'
        );
    }

    const ActualPageCounterComponent = PageCounterComponent
        ? makeStyledPageCounter(PageCounterComponent)
        : StyledPageCounter;

    const listRef = useRef<FlashList<SimpleImageSliderItem>>(null);
    const [currentItem, setCurrentItem] = useState(0);

    const slicedData = useMemo(
        () => (maxItems !== undefined ? data?.slice(0, maxItems) ?? [] : data ?? []),
        [data, maxItems]
    );

    const [currentGroupIndex, setCurrentGroupIndex] = useState(0);

    const nextGroup = useCallback(() => {
        setCurrentGroupIndex((prev) => prev + 1);
    }, []);

    const internalData = useMemo(() => {
        if (dataWindowSize <= 0) {
            return slicedData;
        }
        return slicedData.slice(0, (currentGroupIndex + 1) * dataWindowSize);
    }, [currentGroupIndex, dataWindowSize, slicedData]);

    useEffect(() => {
        setCurrentItem(indexOverride ?? 0);

        listRef.current?.scrollToIndex({ index: indexOverride ?? 0, animated: false });
    }, [indexOverride, slicedData]);

    const keyExtractor = useCallback((item: SimpleImageSliderItem) => item.key, []);

    const renderItem = useCallback(
        ({ item, index }: ListRenderItemInfo<SimpleImageSliderItem>) => {
            return (
                <Pressable
                    onPress={() => {
                        listRef.current?.recordInteraction();
                        onItemPress?.(item, index);
                    }}
                >
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

    const estimatedItemSize = useMemo(() => {
        return imageWidth ?? (imageHeight ? imageHeight * (imageAspectRatio ?? 4 / 3) : 350);
    }, [imageAspectRatio, imageHeight, imageWidth]);

    const internalOnPinchToZoomStatusChange = useCallback(
        (status: PinchToZoomStatus) => {
            listRef.current?.recordInteraction();
            onPinchToZoomStatusChange?.(status);
        },
        [onPinchToZoomStatusChange]
    );

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
            data={internalData}
            onEndReached={nextGroup}
            onEndReachedThreshold={0.5}
            estimatedItemSize={estimatedItemSize}
            estimatedListSize={{
                width: estimatedItemSize,
                height: imageHeight ?? estimatedItemSize / imageAspectRatio,
            }}
        />
    );

    return (
        <StyledContainer aspectRatio={imageAspectRatio} style={style}>
            {enablePinchToZoom ? (
                <StyledPinchToZoom
                    onDismiss={onPinchToZoomRequestClose}
                    onStatusChange={internalOnPinchToZoomStatusChange}
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
                    <ActualPageCounterComponent
                        position={pageCounterPosition}
                        totalPages={slicedData.length}
                        currentPage={currentItem + 1}
                        style={pageCounterStyle}
                        textStyle={pageCounterTextStyle}
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

const makeStyledPageCounter = (
    PageCounterComponent: React.FunctionComponent<PageCounterProps>
) => styled(PageCounterComponent)<{
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}>`
    z-index: 1000;
    position: absolute;
    bottom: ${({ position }) =>
        position === 'bottom-left' || position === 'bottom-right' ? `16px` : 'auto'};
    top: ${({ position }) =>
        position === 'top-left' || position === 'top-right' ? `16px` : 'auto'};
    left: ${({ position }) =>
        position === 'top-left' || position === 'bottom-left' ? `16px` : 'auto'};
    right: ${({ position }) =>
        position === 'top-right' || position === 'bottom-right' ? `16px` : 'auto'};
`;

export default BaseSimpleImageSlider;
