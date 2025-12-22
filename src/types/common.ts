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

export type { RegisterableCallback, RegisteredCallbackConfiguration, CallbackRegistrationFunction };
