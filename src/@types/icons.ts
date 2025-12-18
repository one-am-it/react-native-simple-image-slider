import type { SvgProps } from 'react-native-svg';

export interface IconsProps extends Omit<SvgProps, 'width' | 'height' | 'stroke' | 'strokeWidth'> {
    size?: number;
    stroke?: number;
    color?: string;
}
