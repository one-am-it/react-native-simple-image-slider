import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { IconsProps } from '../@types/icons';

function IconX({ size = 24, color = '#1f2937', stroke = 2, ...props }: IconsProps) {
    return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <Svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            strokeWidth={stroke}
            stroke={color}
            fill="none"
            {...props}
        >
            <Path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <Path d="M18 6l-12 12" />
            <Path d="M6 6l12 12" />
        </Svg>
    );
}
export default IconX;
