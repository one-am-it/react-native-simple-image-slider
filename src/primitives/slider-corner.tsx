import React, { useMemo } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { Z_INDEX_OVERLAY } from '../constants/layout';

type SliderCornerProps = {
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    offset?: number;
};

const SliderCorner = React.memo<SliderCornerProps>(function SliderCorner({
    position,
    children,
    style,
    offset = 16,
}) {
    const positionStyles = useMemo(
        () =>
            StyleSheet.create({
                absolute: {
                    zIndex: Z_INDEX_OVERLAY,
                    position: 'absolute',
                    bottom:
                        position === 'bottom-left' || position === 'bottom-right' ? offset : 'auto',
                    top: position === 'top-left' || position === 'top-right' ? offset : 'auto',
                    left: position === 'top-left' || position === 'bottom-left' ? offset : 'auto',
                    right:
                        position === 'top-right' || position === 'bottom-right' ? offset : 'auto',
                },
            }),
        [offset, position]
    );

    return <View style={[positionStyles.absolute, style]}>{children}</View>;
});

export type { SliderCornerProps };
export { SliderCorner };
