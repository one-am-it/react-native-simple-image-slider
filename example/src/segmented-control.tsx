import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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

function Segment<T extends string>({
    option,
    selected,
    onChange,
}: {
    option: Option<T>;
    selected: boolean;
    onChange: (value: T) => void;
}) {
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

export type { Option, SegmentedControlProps };
export { SegmentedControl };
