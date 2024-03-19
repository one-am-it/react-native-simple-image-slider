import deepmerge from '@fastify/deepmerge';

export const merge = deepmerge({
    mergeArray: (options) => {
        const clone = options.clone;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return function (_, source): any[] {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return clone(source);
        };
    },
});
