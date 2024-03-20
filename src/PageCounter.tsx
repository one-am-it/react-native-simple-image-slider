import React from 'react';
import { type StyleProp, Text, type ViewStyle } from 'react-native';
import styled from 'styled-components/native';

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
};

const StyledContainer = styled.View`
    background-color: ${({ theme }) => theme.colors.simpleImageSlider.pageCounterBackground};
    border-width: 1px;
    border-color: ${({ theme }) => theme.colors.simpleImageSlider.pageCounterBorder};
    border-radius: 8px;
    padding: 8px;
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
