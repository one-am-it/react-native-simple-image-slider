import React, { useMemo } from 'react';

import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

export type AbsoluteComponentContainerProps = PropsWithChildren<{
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}>;

export function AbsoluteComponentContainer({
    position,
    children,
}: AbsoluteComponentContainerProps) {
    const styles = useMemo(() => makeStyles(position), [position]);

    return <View style={styles.container}>{children}</View>;
}

const makeStyles = (position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right') => {
    return StyleSheet.create({
        container: {
            zIndex: 1000,
            position: 'absolute',
            bottom: position === 'bottom-left' || position === 'bottom-right' ? 16 : 'auto',
            top: position === 'top-left' || position === 'top-right' ? 16 : 'auto',
            left: position === 'top-left' || position === 'bottom-left' ? 16 : 'auto',
            right: position === 'top-right' || position === 'bottom-right' ? 16 : 'auto',
        },
    });
};
