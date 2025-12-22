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
    const handlersRef = useRef<Set<NonNullable<F>>>(new Set());

    const register = useCallback((handler: NonNullable<F>) => {
        handlersRef.current.add(handler);

        return () => {
            handlersRef.current.delete(handler);
        };
    }, []);

    const on = useCallback(
        (...args: Parameters<NonNullable<F>>) => {
            handlerProp?.(...args);
            handlersRef.current.forEach((handler) => handler(...args));
        },
        [handlerProp]
    );

    return {
        [`on${capitalize(name)}`]: on,
        [`registerOn${capitalize(name)}`]: register,
    } as RegisteredCallbackConfiguration<F, N>;
}

export { useRegisteredCallback };
