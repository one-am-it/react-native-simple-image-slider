import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';
import type { LayoutChangeEvent, StyleProp } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import type { FlashListRef, ListRenderItemInfo, ViewToken } from '@shopify/flash-list';
import { ScrollView } from 'react-native-gesture-handler';
import { Image } from 'expo-image';
import type { ImageStyle } from 'expo-image';
import mergeRefs from 'merge-refs';
import { useSlider } from '../context/slider-context';
import type { SliderItem } from '../types/context';
import PinchToZoom from '../internal/pinch-to-zoom';

export type SliderContentProps = {
    enablePinchToZoom?: boolean;
    imageStyle?: StyleProp<ImageStyle>;
    maxItems?: number;
    ref?: React.Ref<FlashListRef<SliderItem>>;
};

const SliderContent = forwardRef<FlashListRef<SliderItem>, SliderContentProps>(
    function SliderContent({ enablePinchToZoom = false, imageStyle, maxItems }, ref) {
        const {
            data,
            currentIndex,
            setCurrentIndex,
            imageAspectRatio,
            listRef,
            onItemPress,
            handleLayout,
        } = useSlider();

        const [scrollEnabled, setScrollEnabled] = useState(true);
        const [snapToInterval, setSnapToInterval] = useState<number | undefined>(undefined);

        const slicedData = useMemo(
            () => (maxItems !== undefined ? (data?.slice(0, maxItems) ?? []) : (data ?? [])),
            [data, maxItems]
        );

        const styles = useMemo(
            () =>
                StyleSheet.create({
                    image: {
                        width: '100%',
                        height: '100%',
                        aspectRatio: imageAspectRatio,
                    },
                    pinchToZoom: {
                        zIndex: 1000,
                    },
                }),
            [imageAspectRatio]
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

        const handleListLayout = useCallback(
            (event: LayoutChangeEvent) => {
                handleLayout(event);

                if (Platform.OS === 'ios') {
                    setSnapToInterval(event.nativeEvent.layout.width - 0.5);
                }
            },
            [handleLayout]
        );

        const handleScaleChange = useCallback(() => {
            setScrollEnabled(false);
        }, []);

        const handleScaleReset = useCallback(() => {
            setScrollEnabled(true);
        }, []);

        const list = (
            <FlashList
                renderScrollComponent={ScrollView}
                scrollEnabled={scrollEnabled}
                disableScrollViewPanResponder={enablePinchToZoom ? !scrollEnabled : false}
                ref={mergeRefs(ref, listRef)}
                initialScrollIndex={currentIndex ?? 0}
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
                onLayout={handleListLayout}
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
);

export default SliderContent;
