import React, { useMemo } from 'react';
import { type StyleProp, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { type DefaultTheme, useTheme } from 'styled-components/native';

type PageCounterProps = {
    currentPage: number;
    totalPages: number;
    style?: StyleProp<ViewStyle>;
};

export default function PageCounter({ currentPage, totalPages, style }: PageCounterProps) {
    const theme = useTheme();
    const styles = useMemo(() => makeStyles(theme), [theme]);

    return (
        <View style={[styles.container, style]}>
            <Text>
                {currentPage} / {totalPages}
            </Text>
        </View>
    );
}

const makeStyles = (theme: DefaultTheme) => {
    return StyleSheet.create({
        container: {
            backgroundColor: theme.colors.pageCounterBackground,
            borderWidth: 1,
            borderColor: theme.colors.pageCounterBorder,
            borderRadius: 8,
            paddingHorizontal: 5,
            paddingVertical: 6,
            width: 75,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
    });
};
