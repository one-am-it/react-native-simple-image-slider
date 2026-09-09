import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function CloseIcon({ color }: { color: string }) {
    return (
        <Svg width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} stroke={color} fill="none">
            <Path d="M18 6l-12 12" />
            <Path d="M6 6l12 12" />
        </Svg>
    );
}

export { CloseIcon };
