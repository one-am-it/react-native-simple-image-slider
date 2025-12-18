import React, { isValidElement } from 'react';

export type RenderProp =
    | React.ComponentType<unknown>
    | React.ReactElement
    | string
    | undefined
    | null;

export default function renderProp(Component: RenderProp) {
    return Component ? (
        typeof Component === 'string' ? (
            Component
        ) : isValidElement(Component) ? (
            Component
        ) : (
            // @ts-ignore
            <Component />
        )
    ) : null;
}
