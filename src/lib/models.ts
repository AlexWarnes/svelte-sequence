import type { Tweened } from 'svelte/motion';
import type { Readable, Writable } from 'svelte/store';
export type TimeUnit = 'ms' | 's' | 'm' | 'h' | 'd' | 'w';

export type SequenceType = 'NAMED' | 'INDEXED';
// export type TweenedValue =
// 	| { [key: string]: number }
// 	| number
// 	| number[]
// 	| [number, number]
// 	| [number, number, number]
// 	| [number, number, number, number];

export type NamedSequence<T> = {
	[key: string]: T;
};
export type IndexedSequence<T> = T[];

export type Sequence<T> = NamedSequence<T> | IndexedSequence<T>;

// export interface IndexedTweenedSequence<T> extends Readable<T> {
	// setStep: (step: number) => void;
	// nextStep: () => void;
	// previousStep: () => void;
	// step: Readable<string | number>;
	// step: string | number;
// }

// type NameOrId<T extends number | string> = T extends number
//   ? IdLabel
//   : NameLabel;
// export interface NamedTweenedSequence<T> extends Readable<T> {
	// setStep: (step: string) => void;
	// nextStep: () => void;
	// previousStep: () => void;
	// step: Readable<string | number>;
	// step: string | number;
// }

// type Updater<T> = (target_value: T) => T;

export interface TweenedSequence<T> extends Readable<T> {
		setStep: (step: string | number) => void;
		nextStep: (fn?: null | ((step: number | string) => void)) => void;
		previousStep: (fn?: null | ((step: number | string) => void)) => void;
		value: Tweened<T>,
		step: Writable<string | number>;
		// TODO: figure out how to type this update fn.
		/**
		 * 
		 * @param fn Update function that receives the current sequence as the first arg 
		 * and returns the new sequence.
		 * 
		 * NOTE: the new sequence must be the same "shape" as the original sequence.
		 * 
		 */
		updateSequence: (fn: (currentSequence: any) => any) => void;
		// updateSequence: (updater: (s: Sequence<T>) => Sequence<T>) => void

}

export interface TweenedSequenceOptions {
	duration?: number;
	delay?: number;
	easing?: (t: number) => number;
	initialStep?: number | string;
}

export interface Lap {
	lapNumber: number,
	lapTime: number,
	totalTime: number,
	delta: number
}

// FOR INTERNAL USE - DO NOT EXPORT TO PACKAGE
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
