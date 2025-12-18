import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { useSimpleImageSliderTheme } from './SimpleImageSliderThemeProvider';
import type { SimpleImageSliderTheme } from './SimpleImageSliderThemeProvider';

export type PageCounterProps = {
    /**
     * @description The current page number (**counting from 1**).
     */
    currentPage: number;
    /**
     * @description The total number of pages.
     */
    totalPages: number;
    /**
     * @description Additional styles or styles to override default style of the container View.
     */
    style?: StyleProp<ViewStyle>;
    /**
     * @description Additional styles or styles to override default style of the Text component.
     */
    textStyle?: StyleProp<TextStyle>;
};

export default function PageCounter({
    currentPage,
    totalPages,
    style,
    textStyle,
}: PageCounterProps) {
    const theme = useSimpleImageSliderTheme();
    const styles = useMemo(() => makeStyles(theme), [theme]);

    return (
        <View style={[styles.container, style]}>
            <Text style={textStyle}>
                {currentPage} / {totalPages}
            </Text>
        </View>
    );
}

const makeStyles = (theme: SimpleImageSliderTheme) => {
    return StyleSheet.create({
        container: {
            backgroundColor: theme.colors.pageCounterBackground,
            borderWidth: 1,
            borderColor: theme.colors.pageCounterBorder,
            borderRadius: 8,
            paddingVertical: 6,
            paddingHorizontal: 5,
            width: 75,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
    });
};
