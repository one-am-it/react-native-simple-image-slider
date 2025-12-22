import { useCallback, useRef } from 'react';
import type { RegisterableCallback, RegisteredCallbackConfiguration } from '../types/common';
import { capitalize } from '../utils/capitalize';

type UseRegisteredCallbackInput<F extends RegisterableCallback | undefined, N extends string> = {
    handler: F;
    name: N;
};

function useRegisteredCallback<F extends RegisterableCallback | undefined, N extends string>({
    handler: handlerProp,
    name,
}: UseRegisteredCallbackInput<F, N>): RegisteredCallbackConfiguration<F, N> {
    const handlerRef = useRef<F | null>(null);

    const register = useCallback((handler: F) => {
        handlerRef.current = handler;

        return () => {
            handlerRef.current = null;
        };
    }, []);

    const on = useCallback(
        (...args: Parameters<NonNullable<F>>) => {
            handlerProp?.(...args);
            handlerRef.current?.(...args);
        },
        [handlerProp]
    );

    return {
        [`on${capitalize(name)}`]: on,
        [`registerOn${capitalize(name)}`]: register,
    } as RegisteredCallbackConfiguration<F, N>;
}

export { useRegisteredCallback };
