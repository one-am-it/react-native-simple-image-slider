import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import type { ListRenderItemInfo, ViewToken } from '@shopify/flash-list';
import { ScrollView } from 'react-native-gesture-handler';
import { Image } from 'expo-image';
import type { ImageStyle } from 'expo-image';
import { useSlider } from '../context/slider-context';
import type { SliderItem } from '../types/context';
import { PinchToZoom } from '../internal/pinch-to-zoom';

type SliderContentProps = {
    enablePinchToZoom?: boolean;
    imageStyle?: StyleProp<ImageStyle>;
    maxItems?: number;
    style?: StyleProp<ViewStyle>;
};

function SliderContent({
    enablePinchToZoom = false,
    imageStyle,
    maxItems,
    style,
}: SliderContentProps) {
    const {
        data,
        currentIndex,
        setCurrentIndex,
        imageAspectRatio,
        listRef,
        onItemPress,
        onLayout,
    } = useSlider();

    const [scrollEnabled, setScrollEnabled] = useState(true);
    const [itemWidth, setItemWidth] = useState(0);

    const slicedData = useMemo(
        () => (maxItems !== undefined ? (data?.slice(0, maxItems) ?? []) : (data ?? [])),
        [data, maxItems]
    );

    const styles = useMemo(
        () =>
            StyleSheet.create({
                image: {
                    width: itemWidth,
                    height: '100%',
                },
                pinchToZoom: {
                    zIndex: 1000,
                },
                list: {
                    width: '100%',
                    aspectRatio: imageAspectRatio,
                },
            }),
        [imageAspectRatio, itemWidth]
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
            listRef.current?.recordInteraction();
            onItemPress?.(item, index);
        },
        [listRef, onItemPress]
    );

    const renderItem = useCallback(
        ({ item, index }: ListRenderItemInfo<SliderItem>) => {
            return (
                // eslint-disable-next-line react/jsx-no-bind
                <Pressable onPress={() => handleItemPress(item, index)}>
                    <Image
                        placeholder={item.placeholder}
                        placeholderContentFit={'cover'}
                        recyclingKey={item.key}
                        source={item.source}
                        contentFit={'cover'}
                        contentPosition={'center'}
                        style={[styles.image, imageStyle]}
                    />
                </Pressable>
            );
        },
        [handleItemPress, imageStyle, styles.image]
    );

    const keyExtractor = useCallback((item: SliderItem) => item.key, []);

    const handleScaleChange = useCallback(() => {
        setScrollEnabled(false);
    }, []);

    const handleScaleReset = useCallback(() => {
        setScrollEnabled(true);
    }, []);

    const measureWindowSize = useCallback(() => {
        const windowSize = listRef.current?.getWindowSize();
        setItemWidth(windowSize?.width ?? 0);
    }, [listRef]);

    useLayoutEffect(() => {
        measureWindowSize();
    }, [measureWindowSize]);

    const list = (
        <FlashList
            renderScrollComponent={ScrollView}
            scrollEnabled={scrollEnabled}
            disableScrollViewPanResponder={enablePinchToZoom ? !scrollEnabled : false}
            ref={listRef}
            initialScrollIndex={currentIndex ?? 0}
            onViewableItemsChanged={handleViewableItemsChanged}
            viewabilityConfig={{
                itemVisiblePercentThreshold: 55,
            }}
            pagingEnabled={true}
            decelerationRate={'fast'}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            horizontal={true}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            data={slicedData}
            contentContainerStyle={style}
            onLayout={onLayout}
            style={styles.list}
        />
    );

    if (enablePinchToZoom) {
        return (
            <PinchToZoom
                style={styles.pinchToZoom}
                onScaleChange={handleScaleChange}
                onScaleReset={handleScaleReset}
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
