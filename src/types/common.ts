type RegisterableCallback = (...args: any[]) => void;

type CallbackRegistrationFunction<F extends RegisterableCallback> = (f: F) => () => void;

type RegisteredCallbackConfiguration<
    F extends RegisterableCallback | undefined,
    N extends string,
> = {
    [K in `on${Capitalize<N>}`]: (...args: Parameters<NonNullable<F>>) => void;
} & {
    [K in `registerOn${Capitalize<N>}`]: CallbackRegistrationFunction<NonNullable<F>>;
};

type CallbacksFromEvents<E extends Record<string, RegisterableCallback>> = {
    [K in keyof E as `on${Capitalize<K & string>}`]: (...args: Parameters<E[K]>) => void;
};

type RegisteredCallbacksFromEvents<E extends Record<string, RegisterableCallback>> =
    CallbacksFromEvents<E> & {
        [K in keyof E as `registerOn${Capitalize<K & string>}`]: CallbackRegistrationFunction<E[K]>;
    };

export type {
    RegisterableCallback,
    RegisteredCallbackConfiguration,
    CallbackRegistrationFunction,
    CallbacksFromEvents,
    RegisteredCallbacksFromEvents,
};
