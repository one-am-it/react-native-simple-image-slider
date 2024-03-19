import React from 'react';

export interface IconsProps extends Partial<Omit<React.SVGProps<SVGSVGElement>, 'stroke'>> {
    size?: number;
    stroke?: number;
}
