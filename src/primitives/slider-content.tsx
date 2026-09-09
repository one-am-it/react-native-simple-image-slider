import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ScrollViewProps, StyleProp, ViewStyle } from 'react-native';
import { Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import type { FlashListRef, ListRenderItemInfo, ViewToken } from '@shopify/flash-list';
import { FlashList } from '@shopify/flash-list';
import { ScrollView } from 'react-native-gesture-handler';
import type { ImageStyle } from 'expo-image';
import { Image } from 'expo-image';
import { useSliderContext } from '../context/slider-context';
import type { SliderItem } from '../types';
import { PinchToZoom } from '../internal/pinch-to-zoom';
import { useIsFullScreenSlider } from '../context/slider-full-screen-context';
import { VIEWABILITY_THRESHOLD, Z_INDEX_OVERLAY } from '../constants/layout';

type SliderContentProps = {
    enablePinchToZoom?: boolean;
    imageStyle?: StyleProp<ImageStyle>;
    maxItems?: number;
    style?: StyleProp<ViewStyle>;
    imageAccessibilityLabel?: string | ((imageNumber: number, totalItems: number) => string);
    pressableAccessibilityHint?: string;
};

function SliderContent({
    enablePinchToZoom = false,
    imageStyle,
    maxItems,
    style,
    imageAccessibilityLabel,
    pressableAccessibilityHint = 'Double tap to open full screen',
}: SliderContentProps) {
    const {
        data,
        totalItems,
        currentIndex,
        setCurrentIndex,
        imageAspectRatio,
        containerWidth,
        registerScrollFn,
        onItemPress,
        hasItemPress,
        hasFullScreen,
        openFullScreen,
        onPinchStatusChange,
        onPinchDismiss,
    } = useSliderContext();
    const isFullScreenSlider = useIsFullScreenSlider();
    const windowDimensions = useWindowDimensions();

    const [scrollEnabled, setScrollEnabled] = useState(true);
    const [itemWidth, setItemWidth] = useState(
        isFullScreenSlider ? windowDimensions.width : containerWidth
    );

    const localListRef = useRef<FlashListRef<SliderItem>>(null);

    const slicedData = useMemo(
        () => (maxItems !== undefined ? (data?.slice(0, maxItems) ?? []) : (data ?? [])),
        [data, maxItems]
    );

    const resolvedItemWidth = itemWidth > 0 ? itemWidth : containerWidth;

    const styles = useMemo(
        () =>
            StyleSheet.create({
                image: {
                    width: isFullScreenSlider ? windowDimensions.width : resolvedItemWidth,
                    height: '100%',
                },
                pinchToZoom: {
                    zIndex: Z_INDEX_OVERLAY,
                },
                list: {
                    width: '100%',
                    aspectRatio: imageAspectRatio,
                },
            }),
        [imageAspectRatio, isFullScreenSlider, resolvedItemWidth, windowDimensions.width]
    );

    const handleViewableItemsChanged = useCallback(
        ({
            viewableItems,
        }: {
            viewableItems: ViewToken<SliderItem>[];
            changed: ViewToken<SliderItem>[];
        }) => {
            const newIndex = viewableItems[0]?.index;
            if (newIndex !== undefined && newIndex !== null) {
                setCurrentIndex(newIndex);
            }
        },
        [setCurrentIndex]
    );

    const handleItemPress = useCallback(
        (item: SliderItem, index: number) => {
            localListRef.current?.recordInteraction();
            onItemPress?.(item, index);
            if (hasFullScreen) {
                openFullScreen();
            }
        },
        [onItemPress, hasFullScreen, openFullScreen]
    );

    const renderItem = useCallback(
        ({ item, index }: ListRenderItemInfo<SliderItem>) => {
            const imageNumber = index + 1;
            const label =
                typeof imageAccessibilityLabel === 'function'
                    ? imageAccessibilityLabel(imageNumber, totalItems)
                    : (imageAccessibilityLabel ?? `Image ${imageNumber} of ${totalItems}`);

            const content = (
                <Image
                    placeholder={item.placeholder}
                    placeholderContentFit={'cover'}
                    recyclingKey={item.key}
                    source={item.source}
                    contentFit={'cover'}
                    contentPosition={'center'}
                    style={[styles.image, imageStyle]}
                    accessible={true}
                    accessibilityRole="image"
                    accessibilityLabel={label}
                />
            );
            if (isFullScreenSlider) {
                return content;
            }

            // A slide is only a control when a tap has somewhere to go; announcing it as a button
            // regardless told a screen reader every photo did something. The Pressable stays in the
            // tree either way so the Image is not remounted when `hasFullScreen` flips after mount.
            const inert = !hasItemPress && !hasFullScreen;
            const handlePress = () => handleItemPress(item, index);

            return (
                <Pressable
                    // eslint-disable-next-line react/jsx-no-bind
                    onPress={handlePress}
                    disabled={inert}
                    accessible={!inert}
                    accessibilityRole={inert ? undefined : 'imagebutton'}
                    accessibilityLabel={inert ? undefined : label}
                    accessibilityHint={inert ? undefined : pressableAccessibilityHint}
                >
                    {content}
                </Pressable>
            );
        },
        [
            handleItemPress,
            imageStyle,
            isFullScreenSlider,
            styles.image,
            totalItems,
            imageAccessibilityLabel,
            pressableAccessibilityHint,
            hasItemPress,
            hasFullScreen,
        ]
    );

    const keyExtractor = useCallback((item: SliderItem) => item.key, []);

    const handleScaleChange = useCallback(() => {
        setScrollEnabled(false);
    }, []);

    const handleScaleReset = useCallback(() => {
        setScrollEnabled(true);
    }, []);

    const measureWindowSize = useCallback(() => {
        if (!isFullScreenSlider) {
            const windowSize = localListRef.current?.getWindowSize();
            setItemWidth(windowSize?.width ?? containerWidth);
        }
    }, [isFullScreenSlider, containerWidth]);

    const renderScrollComponent = useCallback(
        (props: ScrollViewProps) => <ScrollView {...props} />,
        []
    );

    useEffect(() => {
        if (isFullScreenSlider) return;

        return registerScrollFn((index, animated = true) => {
            localListRef.current?.scrollToIndex({ index, animated });
        });
    }, [registerScrollFn, isFullScreenSlider]);

    if (totalItems === 0) {
        return null;
    }

    if (!isFullScreenSlider && containerWidth === 0) {
        return null;
    }

    const list = (
        <FlashList
            renderScrollComponent={renderScrollComponent}
            scrollEnabled={scrollEnabled}
            disableScrollViewPanResponder={enablePinchToZoom ? !scrollEnabled : false}
            ref={localListRef}
            initialScrollIndex={currentIndex}
            onViewableItemsChanged={handleViewableItemsChanged}
            viewabilityConfig={{
                itemVisiblePercentThreshold: VIEWABILITY_THRESHOLD,
            }}
            onCommitLayoutEffect={measureWindowSize}
            pagingEnabled={true}
            decelerationRate={'fast'}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            horizontal={true}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            data={slicedData}
            contentContainerStyle={style}
            style={styles.list}
        />
    );

    if (enablePinchToZoom) {
        return (
            <PinchToZoom
                style={styles.pinchToZoom}
                onScaleChange={handleScaleChange}
                onScaleReset={handleScaleReset}
                onStatusChange={onPinchStatusChange}
                onDismiss={onPinchDismiss}
                maximumZoomScale={5}
                minimumZoomScale={1}
            >
                {list}
            </PinchToZoom>
        );
    }

    return list;
}

export type { SliderContentProps };
export { SliderContent };
