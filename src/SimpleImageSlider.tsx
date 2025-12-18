import React, { useCallback, useRef, useState } from 'react';
import type { FlashListRef } from '@shopify/flash-list';
import mergeRefs from 'merge-refs';
import FullScreenImageSlider from './FullScreenImageSlider';
import type { FullScreenImageSliderProps } from './FullScreenImageSlider';
import BaseListImageSlider from './BaseSimpleImageSlider';
import type { BaseSimpleImageSliderProps } from './BaseSimpleImageSlider';
import type { SimpleImageSliderItem } from './@types/slider';

export type SimpleImageSliderProps = BaseSimpleImageSliderProps & {
    /**
     * @description Whether the full screen mode is enabled or not. **Caution:** when this is enabled, the `onItemPress` prop will be ignored.
     * @default false
     */
    fullScreenEnabled?: boolean;
    /**
     * @description Passed to the {@link FullScreenImageSlider} component.
     */
    renderFullScreenDescription?: FullScreenImageSliderProps['renderDescription'];
    /**
     * @description Passed to the {@link FullScreenImageSlider} component.
     */
    FullScreenCloseButtonIcon?: FullScreenImageSliderProps['CloseButtonIcon'];
    /**
     * @description The aspect ratio of the images when full screen.
     *
     * @default {@link FullScreenImageSliderProps.imageAspectRatio}
     */
    fullScreenImageAspectRatio?: number;
};

/**
 * @description A simple image slider that displays images in a list and can show a {@link FullScreenImageSlider} on press.
 */
function SimpleImageSlider({
    data,
    fullScreenEnabled = false,
    onItemPress,
    onViewableItemChange,
    FullScreenCloseButtonIcon,
    renderFullScreenDescription,
    imageAspectRatio,
    fullScreenImageAspectRatio,
    ref,
    ...props
}: SimpleImageSliderProps) {
    const listRef = useRef<FlashListRef<SimpleImageSliderItem>>(null);
    const fullScreenListRef = useRef<FlashListRef<SimpleImageSliderItem>>(null);

    const [fullScreen, setFullScreen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const internalOnViewableItemChange = useCallback(
        (index: number) => {
            setCurrentIndex(index);
            onViewableItemChange?.(index);
        },
        [onViewableItemChange]
    );

    const onFullScreenViewableItemChange = useCallback((index: number) => {
        setCurrentIndex(index);
    }, []);

    const openFullScreen = useCallback(() => {
        setFullScreen(true);
    }, []);

    const onRequestClose = useCallback(() => {
        listRef.current?.scrollToIndex({ index: currentIndex });
        setFullScreen(false);
    }, [currentIndex]);

    const onFadeOut = useCallback(() => {
        listRef.current?.scrollToIndex({ index: currentIndex });
    }, [currentIndex]);

    return (
        <>
            <BaseListImageSlider
                {...props}
                imageAspectRatio={imageAspectRatio}
                data={data}
                ref={mergeRefs(ref, listRef)}
                onItemPress={fullScreenEnabled ? openFullScreen : onItemPress}
                onViewableItemChange={internalOnViewableItemChange}
            />
            {fullScreenEnabled ? (
                <FullScreenImageSlider
                    {...props}
                    imageAspectRatio={fullScreenImageAspectRatio ?? imageAspectRatio}
                    ref={fullScreenListRef}
                    open={fullScreen}
                    onRequestClose={onRequestClose}
                    data={data}
                    showPageCounter={false}
                    indexOverride={currentIndex}
                    onViewableItemChange={onFullScreenViewableItemChange}
                    renderDescription={renderFullScreenDescription}
                    CloseButtonIcon={FullScreenCloseButtonIcon}
                    onFadeOut={onFadeOut}
                />
            ) : null}
        </>
    );
}

export default SimpleImageSlider;
