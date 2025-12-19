import { useMemo } from 'react';
import { useImage } from 'expo-image';
import type { ImageSource } from 'expo-image';

type UseImageAspectRatioResult = {
    aspectRatio: number;
    isLoading: boolean;
};

const DEFAULT_ASPECT_RATIO = 4 / 3;

function useImageAspectRatio(
    source: ImageSource | undefined,
    overrideAspectRatio?: number
): UseImageAspectRatioResult {
    // If override is provided or source is undefined, don't attempt to load
    const shouldDetect = overrideAspectRatio === undefined && source !== undefined;

    // useImage returns null while loading, then ImageRef with width/height
    // Use a minimal placeholder source when detection is not needed to satisfy the hook signature
    const imageRef = useImage(shouldDetect ? source : ({ uri: '' } as ImageSource));

    const result = useMemo(() => {
        // If override provided, use it immediately
        if (overrideAspectRatio !== undefined) {
            return { aspectRatio: overrideAspectRatio, isLoading: false };
        }

        // If no source, use default
        if (!source) {
            return { aspectRatio: DEFAULT_ASPECT_RATIO, isLoading: false };
        }

        // If still loading
        if (!imageRef) {
            return { aspectRatio: DEFAULT_ASPECT_RATIO, isLoading: true };
        }

        // Compute aspect ratio from detected dimensions
        const { width, height } = imageRef;
        if (width > 0 && height > 0) {
            return { aspectRatio: width / height, isLoading: false };
        }

        // Fallback if dimensions are invalid
        return { aspectRatio: DEFAULT_ASPECT_RATIO, isLoading: false };
    }, [overrideAspectRatio, source, imageRef]);

    return result;
}

export { useImageAspectRatio, DEFAULT_ASPECT_RATIO };
export type { UseImageAspectRatioResult };
