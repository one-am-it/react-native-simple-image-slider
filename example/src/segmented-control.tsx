import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { Segment } from './segment';
import { usePalette } from './theme';

type Option<T extends string> = {
    value: T;
    label: string;
};

type SegmentedControlProps<T extends string> = {
    options: readonly Option<T>[];
    value: T;
    onChange: (value: T) => void;
};

function SegmentedControl<T extends string>({
    options,
    value,
    onChange,
}: SegmentedControlProps<T>) {
    const palette = usePalette();

    return (
        <View style={[styles.track, { backgroundColor: palette.border }]}>
            {options.map((option) => (
                <Segment
                    key={option.value}
                    option={option}
                    selected={option.value === value}
                    onChange={onChange}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    track: {
        flexDirection: 'row',
        borderRadius: 10,
        padding: 2,
        gap: 2,
    },
});

export type { Option, SegmentedControlProps };
export { SegmentedControl };
