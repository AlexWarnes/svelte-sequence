import type { Lap } from './models';
export declare const stopwatch: (startTime?: number) => {
    subscribe: (this: void, run: import("svelte/store").Subscriber<number>, invalidate?: ((value?: number | undefined) => void) | undefined) => import("svelte/store").Unsubscriber;
    start: () => void;
    pause: () => void;
    reset: () => void;
    laps: import("svelte/store").Writable<Lap[]>;
    addLap: () => void;
};
