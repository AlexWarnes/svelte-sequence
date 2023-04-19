import type { Tweened } from 'svelte/motion';
import type { Readable, Writable } from 'svelte/store';
export type TimeUnit = 'ms' | 's' | 'm' | 'h' | 'd' | 'w';
export type SequenceType = 'NAMED' | 'INDEXED';
export type NamedSequence<T> = {
    [key: string]: T;
};
export type IndexedSequence<T> = T[];
export type Sequence<T> = NamedSequence<T> | IndexedSequence<T>;
export interface TweenedSequence<T> extends Readable<T> {
    setStep: (step: string | number, options?: TweenedSequenceOptions) => void;
    nextStep: (options?: TweenedSequenceOptions) => void;
    previousStep: (options?: TweenedSequenceOptions) => void;
    value: Tweened<T>;
    step: Writable<string | number>;
    /**
     *
     * @param fn Update function that receives the current sequence as the first arg
     * and returns the new sequence.
     *
     * NOTE: the new sequence must be the same "shape" as the original sequence.
     *
     */
    updateSequence: (fn: (currentSequence: any) => any, options?: TweenedSequenceOptions) => void;
}
export interface TweenedSequenceOptions {
    duration?: number;
    delay?: number;
    easing?: (t: number) => number;
    initialStep?: number | string;
}
export interface Lap {
    lapNumber: number;
    lapTime: number;
    totalTime: number;
    delta: number;
}
export type Vector2 = {
    x: number;
    y: number;
    clone: () => void;
    setX: (n: number) => void;
    setY: (n: number) => void;
    setZ: (n: number) => void;
};
export type Vector3 = {
    x: number;
    y: number;
    z: number;
    clone: () => Vector3;
    setX: (n: number) => Vector3;
    setY: (n: number) => Vector3;
    setZ: (n: number) => Vector3;
};
