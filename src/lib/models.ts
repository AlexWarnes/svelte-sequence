import type { Readable } from 'svelte/store';
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

export interface IndexedTweenedSequence<T> extends Readable<T> {
	// setStep: (step: number) => void;
	// nextStep: () => void;
	// previousStep: () => void;
	// step: Readable<string | number>;
	// step: string | number;
}

// type NameOrId<T extends number | string> = T extends number
//   ? IdLabel
//   : NameLabel;
export interface NamedTweenedSequence<T> extends Readable<T> {
	// setStep: (step: string) => void;
	// nextStep: () => void;
	// previousStep: () => void;
	// step: Readable<string | number>;
	// step: string | number;
}

export interface TweenedSequence<T> extends Readable<T> {
		setStep: (step: string | number) => void;
		nextStep: () => void;
		previousStep: () => void;	
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
// FOR INTERNAL TESTING - DO NOT EXPORT TO PACKAGE
export type v2 = {
	x: number;
	y: number;
};
