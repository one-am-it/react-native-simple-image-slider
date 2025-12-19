import React, { isValidElement } from 'react';

type RenderProp = React.ComponentType<unknown> | React.ReactElement | undefined | null;

function renderProp(Component: RenderProp) {
    if (!Component) {
        return null;
    }

    if (isValidElement(Component)) {
        return Component;
    }

    const ComponentToRender = Component as React.ComponentType;
    return <ComponentToRender />;
}

export type { RenderProp };
export { renderProp };
