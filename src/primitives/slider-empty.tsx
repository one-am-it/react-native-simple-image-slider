import React from 'react';
import { View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { useSlider } from '../context/slider-context';

type SliderEmptyProps = {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
};

const SliderEmpty = React.memo<SliderEmptyProps>(function SliderEmpty({ children, style }) {
    const { totalItems } = useSlider();

    return totalItems === 0 ? <View style={style}>{children}</View> : null;
});

export type { SliderEmptyProps };
export { SliderEmpty };
