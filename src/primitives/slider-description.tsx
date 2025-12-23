import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DESCRIPTION_OFFSET, SAFE_AREA_OFFSET } from '../constants/layout';

type SliderDescriptionProps = {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
};

function SliderDescription({ children, style }: SliderDescriptionProps) {
    const safeAreaInsets = useSafeAreaInsets();

    const positionStyles = useMemo(
        () =>
            StyleSheet.create({
                descriptionContainer: {
                    position: 'absolute',
                    borderTopWidth: 1,
                    borderTopColor: '#FFFFFF',
                    width: '100%',
                    paddingTop: SAFE_AREA_OFFSET,
                    bottom: safeAreaInsets.bottom + DESCRIPTION_OFFSET,
                    paddingLeft: safeAreaInsets.left + SAFE_AREA_OFFSET,
                    paddingRight: safeAreaInsets.right + SAFE_AREA_OFFSET,
                },
            }),
        [safeAreaInsets.bottom, safeAreaInsets.left, safeAreaInsets.right]
    );

    return <View style={[positionStyles.descriptionContainer, style]}>{children}</View>;
}

export type { SliderDescriptionProps };
export { SliderDescription };
