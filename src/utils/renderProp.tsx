import React, { isValidElement } from 'react';

export type RenderProp = React.ComponentType<unknown> | React.ReactElement | undefined | null;

export default function renderProp(Component: RenderProp) {
    if (!Component) {
        return null;
    }

    if (isValidElement(Component)) {
        return Component;
    }

    const ComponentToRender = Component as React.ComponentType;
    return <ComponentToRender />;
}
