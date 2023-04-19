import type { TimeUnit } from './models';
export declare const timer: (time: number, unit?: TimeUnit) => {
    subscribe: (this: void, run: import("svelte/store").Subscriber<number>, invalidate?: ((value?: number | undefined) => void) | undefined) => import("svelte/store").Unsubscriber;
    start: () => void;
    pause: () => void;
    reset: () => void;
    add: (time: number, unit?: TimeUnit) => void;
};
