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
import { Image, type ImageStyle } from 'expo-image';
import {
    type LayoutChangeEvent,
    Platform,
    Pressable,
    type StyleProp,
    StyleSheet,
    type TextStyle,
    type ViewStyle,
} from 'react-native';
import type ViewToken from '@shopify/flash-list/src/viewability/ViewToken';
import PageCounter, { type PageCounterProps } from './PageCounter';
import PinchToZoom, { type PinchToZoomProps } from './PinchToZoom';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import renderProp, { type RenderProp } from './utils/renderProp';
import type { SimpleImageSliderItem } from './@types/slider';
import type { PinchToZoomStatus } from './@types/pinch-to-zoom';
import Animated from 'react-native-reanimated';
import { AbsoluteComponentContainer } from './AbsoluteComponentContainer';

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
     * @description Callback that renders the page counter. Overrides `PageCounterComponent` if provided.
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
     * @description The tag to be used for shared transitions. This is applied to the current image in the list.
     */
    sharedTransitionTag?: string;
    /**
     * @description Style that will be applied to every image in the slider.
     */
    imageStyle?: StyleProp<ImageStyle>;
};

const AnimatedImage = Animated.createAnimatedComponent(Image);

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
        PageCounterComponent = PageCounter,
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
        sharedTransitionTag,
        imageStyle,
    },
    ref
) {
    const listRef = useRef<FlashList<SimpleImageSliderItem>>(null);

    const styles = useMemo(
        () => makeStyles({ imageAspectRatio, imageWidth, imageHeight }),
        [imageAspectRatio, imageHeight, imageWidth]
    );
    const slicedData = useMemo(
        () => (maxItems !== undefined ? (data?.slice(0, maxItems) ?? []) : (data ?? [])),
        [data, maxItems]
    );
    const estimatedItemSize = useMemo(() => {
        return imageWidth ?? (imageHeight ? imageHeight * (imageAspectRatio ?? 4 / 3) : 350);
    }, [imageAspectRatio, imageHeight, imageWidth]);

    const [currentItem, setCurrentItem] = useState(0);
    const [scrollEnabled, setScrollEnabled] = useState(true);
    const [snapToInterval, setSnapToInterval] = useState<number | undefined>(undefined);

    const handleScaleChange = useCallback(() => {
        setScrollEnabled(false);
    }, []);

    const handleScaleReset = useCallback(() => {
        setScrollEnabled(true);
    }, []);

    const handleViewableItemsChanged = useCallback(
        ({ viewableItems }: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
            const newIndex = viewableItems[0]?.index;
            if (newIndex !== undefined && newIndex !== null) {
                setCurrentItem(newIndex);
                onViewableItemChange?.(newIndex);
            }
        },
        [onViewableItemChange]
    );

    const handlePinchToZoomStatusChange = useCallback(
        (status: PinchToZoomStatus) => {
            listRef.current?.recordInteraction();
            onPinchToZoomStatusChange?.(status);
        },
        [onPinchToZoomStatusChange]
    );

    const renderItem = useCallback(
        ({ item, index }: ListRenderItemInfo<SimpleImageSliderItem>) => {
            const ImageComponent =
                sharedTransitionTag && index === currentItem ? AnimatedImage : Image;

            return (
                <Pressable
                    onPress={() => {
                        listRef.current?.recordInteraction();
                        onItemPress?.(item, index);
                    }}
                >
                    <ImageComponent
                        sharedTransitionTag={sharedTransitionTag}
                        transition={200}
                        // https://github.com/expo/expo/issues/34810
                        /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
                        placeholder={item.placeholder}
                        placeholderContentFit={'cover'}
                        recyclingKey={item.key}
                        // https://github.com/expo/expo/issues/34810
                        /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
                        source={item.source}
                        contentFit={'cover'}
                        contentPosition={'center'}
                        style={[styles.image, imageStyle]}
                    />
                </Pressable>
            );
        },
        [currentItem, imageStyle, onItemPress, sharedTransitionTag, styles.image]
    );

    const keyExtractor = useCallback((item: SimpleImageSliderItem) => item.key, []);

    const handleListLayout = useCallback((event: LayoutChangeEvent) => {
        if (Platform.OS === 'ios') {
            // temporary workaround for iOS scrolling a bit more than expected
            setSnapToInterval(event.nativeEvent.layout.width - 0.5);
        }
    }, []);

    useEffect(() => {
        setCurrentItem(indexOverride ?? 0);

        listRef.current?.scrollToIndex({ index: indexOverride ?? 0, animated: false });
    }, [indexOverride, slicedData]);

    const list = (
        <FlashList
            renderScrollComponent={ScrollView}
            scrollEnabled={scrollEnabled}
            disableScrollViewPanResponder={enablePinchToZoom ? !scrollEnabled : false}
            ref={mergeRefs(ref, listRef)}
            initialScrollIndex={indexOverride ?? currentItem ?? 0}
            onViewableItemsChanged={handleViewableItemsChanged}
            viewabilityConfig={{
                itemVisiblePercentThreshold: 55,
            }}
            decelerationRate={'fast'}
            pagingEnabled={snapToInterval === undefined}
            snapToInterval={snapToInterval}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            horizontal={true}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            data={slicedData}
            estimatedItemSize={estimatedItemSize}
            estimatedListSize={{
                width: estimatedItemSize,
                height: imageHeight ?? estimatedItemSize / imageAspectRatio,
            }}
            onLayout={handleListLayout}
        />
    );

    return (
        <GestureHandlerRootView style={[styles.container, style]}>
            {enablePinchToZoom ? (
                <PinchToZoom
                    style={styles.pinchToZoom}
                    onDismiss={onPinchToZoomRequestClose}
                    onStatusChange={handlePinchToZoomStatusChange}
                    onScaleChange={handleScaleChange}
                    onScaleReset={handleScaleReset}
                    maximumZoomScale={5}
                    minimumZoomScale={1}
                >
                    {list}
                </PinchToZoom>
            ) : (
                list
            )}
            {showPageCounter ? (
                renderPageCounter ? (
                    renderPageCounter(currentItem + 1, slicedData.length)
                ) : (
                    <AbsoluteComponentContainer position={pageCounterPosition}>
                        <PageCounterComponent
                            totalPages={slicedData.length}
                            currentPage={currentItem + 1}
                            style={pageCounterStyle}
                            textStyle={pageCounterTextStyle}
                        />
                    </AbsoluteComponentContainer>
                )
            ) : null}
            {TopRightComponent ? (
                <AbsoluteComponentContainer position={'top-right'}>
                    {renderProp(TopRightComponent)}
                </AbsoluteComponentContainer>
            ) : null}
            {TopLeftComponent ? (
                <AbsoluteComponentContainer position={'top-left'}>
                    {renderProp(TopLeftComponent)}
                </AbsoluteComponentContainer>
            ) : null}
            {BottomRightComponent ? (
                <AbsoluteComponentContainer position={'bottom-right'}>
                    {renderProp(BottomRightComponent)}
                </AbsoluteComponentContainer>
            ) : null}
            {BottomLeftComponent ? (
                <AbsoluteComponentContainer position={'bottom-left'}>
                    {renderProp(BottomLeftComponent)}
                </AbsoluteComponentContainer>
            ) : null}
        </GestureHandlerRootView>
    );
});

const makeStyles = ({
    imageAspectRatio,
    imageWidth,
    imageHeight,
}: {
    imageAspectRatio?: number;
    imageWidth?: number;
    imageHeight?: number;
}) => {
    return StyleSheet.create({
        container: {
            width: '100%',
            aspectRatio: imageAspectRatio ?? 4 / 3,
        },
        pinchToZoom: {
            zIndex: 1000,
        },
        image: {
            width: imageWidth ?? '100%',
            height: imageHeight ?? '100%',
            aspectRatio: imageAspectRatio ?? 4 / 3,
        },
    });
};

export default BaseSimpleImageSlider;
