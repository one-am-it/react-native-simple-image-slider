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
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            <Component />
        )
    ) : null;
}
