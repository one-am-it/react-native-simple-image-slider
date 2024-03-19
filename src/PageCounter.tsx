import React from 'react';
import { type StyleProp, Text, type ViewStyle } from 'react-native';
import styled from 'styled-components/native';

type PageCounterProps = {
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
};

const StyledContainer = styled.View`
    background-color: ${({ theme }) => theme.colors.pageCounterBackground};
    border-width: ${({ theme }) => theme.styles.borderWidth.xs}px;
    border-color: ${({ theme }) => theme.colors.pageCounterBorder};
    border-radius: ${({ theme }) => theme.styles.borderRadius.m}px;
    padding: ${({ theme }) => `${theme.styles.spacing.s}px ${theme.styles.spacing.s}px`};
    width: 75px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`;

export default function PageCounter({ currentPage, totalPages, style }: PageCounterProps) {
    return (
        <StyledContainer style={style}>
            <Text>
                {currentPage} / {totalPages}
            </Text>
        </StyledContainer>
    );
}
