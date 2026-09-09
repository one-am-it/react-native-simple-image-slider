import * as React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import type { Option } from './segmented-control';
import { usePalette } from './theme';

type SegmentProps<T extends string> = {
    option: Option<T>;
    selected: boolean;
    onChange: (value: T) => void;
};

function Segment<T extends string>({ option, selected, onChange }: SegmentProps<T>) {
    const palette = usePalette();
    const press = React.useCallback(() => onChange(option.value), [onChange, option.value]);

    return (
        <Pressable
            onPress={press}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            style={[styles.segment, selected ? { backgroundColor: palette.surface } : null]}
        >
            <Text
                style={[
                    styles.label,
                    { color: selected ? palette.text : palette.muted },
                    selected ? styles.labelSelected : null,
                ]}
            >
                {option.label}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    segment: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
    },
    labelSelected: {
        fontWeight: '600',
    },
});

export type { SegmentProps };
export { Segment };
