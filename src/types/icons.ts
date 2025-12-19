import type { SvgProps } from 'react-native-svg';

type IconsProps = Omit<SvgProps, 'width' | 'height' | 'stroke' | 'strokeWidth'> & {
    size?: number;
    stroke?: number;
    color?: string;
};

export type { IconsProps };
