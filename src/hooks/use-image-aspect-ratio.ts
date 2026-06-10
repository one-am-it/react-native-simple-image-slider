import { useMemo } from 'react';
import type { ImageProps, ImageSource } from 'expo-image';
import { useImage } from 'expo-image';
import type { SliderAspectRatioState } from '../types';

const DEFAULT_ASPECT_RATIO = 4 / 3;

// 1x1 transparent PNG data URI used as placeholder when aspect ratio detection is not needed
const PLACEHOLDER_SOURCE = {
    uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
} as const;

type UseImageSource = ImageSource | string | number;

function toUseImageSource(source: ImageProps['source']): UseImageSource | undefined {
    if (source == null || Array.isArray(source)) return undefined;
    // SharedRef objects (ImageRef) have a nativeRefType property — not accepted by useImage
    if (typeof source === 'object' && 'nativeRefType' in source) return undefined;
    return source as UseImageSource;
}

function useImageAspectRatio(
    source: ImageProps['source'],
    overrideAspectRatio?: number
): SliderAspectRatioState {
    const useImageSource = toUseImageSource(source);
    const shouldDetect = overrideAspectRatio === undefined && useImageSource !== undefined;

    // useImage returns null while loading, then ImageRef with width/height
    // Use a valid placeholder image when detection is not needed to satisfy the hook signature
    const imageRef = useImage(
        shouldDetect && useImageSource !== undefined ? useImageSource : PLACEHOLDER_SOURCE
    );

    const result = useMemo(() => {
        // If override provided, use it immediately
        if (overrideAspectRatio !== undefined) {
            return { imageAspectRatio: overrideAspectRatio, isAspectRatioLoading: false };
        }

        // If source is not accepted by useImage (null, array, SharedRef), use default
        if (!useImageSource) {
            return { imageAspectRatio: DEFAULT_ASPECT_RATIO, isAspectRatioLoading: false };
        }

        // If still loading
        if (!imageRef) {
            return { imageAspectRatio: DEFAULT_ASPECT_RATIO, isAspectRatioLoading: true };
        }

        // Compute aspect ratio from detected dimensions
        const { width, height } = imageRef;
        if (width > 0 && height > 0) {
            return { imageAspectRatio: width / height, isAspectRatioLoading: false };
        }

        // Fallback if dimensions are invalid
        return { imageAspectRatio: DEFAULT_ASPECT_RATIO, isAspectRatioLoading: false };
    }, [overrideAspectRatio, useImageSource, imageRef]);

    return result;
}

export { useImageAspectRatio, toUseImageSource, DEFAULT_ASPECT_RATIO };
