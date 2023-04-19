import { tweened } from 'svelte/motion';
import { linear } from 'svelte/easing';
import type {
	IndexedSequence,
	// IndexedTweenedSequence,
	NamedSequence,
	// NamedTweenedSequence,
	Sequence,
	SequenceType,
	TweenedSequence,
	TweenedSequenceOptions,
	Vector3
} from './models';
import { writable } from 'svelte/store';
import { onDestroy } from 'svelte';

const defaultOptions: TweenedSequenceOptions = {
	duration: 1000,
	easing: linear,
	delay: 0
};

function calculateNextValueFromFract<T>(a: T, b: T, factor: number): T {
	if (typeof a === 'number' && typeof b === 'number') {
		// handle numbers
		return ((b - a) * factor + a) as T;
	}

	if (Array.isArray(a) && Array.isArray(b)) {
		// handle arrays
		const temp = [...a];
		a.forEach((val, idx) => {
			temp[idx] = (b[idx] - val) * factor + val;
		});
		return temp as T;
	}

	// TODO: See if this even works to handle threejs vector3
	// @ts-ignore
	if (a.isVector3 && b.isVector3) {
		// handle threejs vector3
		const v3 = (a as Vector3)
			.clone()
			.setX(
				(((b as Vector3)['x'] as number) - ((a as Vector3)['x'] as number)) * factor +
					((a as Vector3)['x'] as number)
			)
			.setY(
				(((b as Vector3)['y'] as number) - ((a as Vector3)['y'] as number)) * factor +
					((a as Vector3)['y'] as number)
			)
			.setZ(
				(((b as Vector3)['z'] as number) - ((a as Vector3)['z'] as number)) * factor +
					((a as Vector3)['z'] as number)
			);
		return v3 as T;
	}

	if (!!a && !!b && typeof a === 'object' && typeof b === 'object') {
		// handle objects
		const temp = {};
		Object.keys(a).forEach((k) => {
			// TODO
			// @ts-ignore
			temp[k] = ((b[k] as number) - (a[k] as number)) * factor + (a[k] as number);
		});
		return temp as T;
	}

	return b;
}

function updateOptions(
	currentOptions: TweenedSequenceOptions,
	newOptions: TweenedSequenceOptions | undefined
): TweenedSequenceOptions {
	if (!newOptions) return currentOptions;

	let duration = newOptions.duration ?? currentOptions.duration;
	let easing = newOptions.easing ?? currentOptions.easing;
	let delay = newOptions.delay ?? currentOptions.delay;
	let initialStep = newOptions.initialStep ?? currentOptions.initialStep;
	return { duration, easing, delay, initialStep };
}

function createIndexedSequence<T>(
	_sequence: IndexedSequence<T>,
	options: TweenedSequenceOptions
): TweenedSequence<T> {
	let sequence = _sequence;
	const seqType: SequenceType = 'INDEXED';
	let { duration, delay, easing, initialStep: _iStep } = updateOptions(defaultOptions, options);
	let initialStep = (_iStep as number) ?? 0;

	// Validate initial step
	if (initialStep < 0 || initialStep > sequence.length) {
		console.error(
			`Step "${initialStep}" is an invalid initialStep for your sequence of length ${
				sequence.length
			}. A valid step satisfies: 0 <= step <= ${sequence.length - 1}`
		);
	}

	function syncOptions(newOptions: TweenedSequenceOptions | undefined) {
		const updatedOptions = updateOptions({ duration, easing, delay, initialStep }, newOptions);
		duration = updatedOptions.duration;
		easing = updatedOptions.easing;
		delay = updatedOptions.delay;
		initialStep = updatedOptions.initialStep as number;
	}

	const step = writable(initialStep);
	const value = tweened<T>(sequence[initialStep], { duration, easing, delay });
	const { subscribe, set, update } = value;
	let previousStep: number = initialStep;

	// lil fractional helper
	const fract = (num: number) => num % 1.0;

	const setStep = (step: string | number) => {
		if (typeof step !== 'number') {
			console.error(
				`Step "${step}" is not assignable to an indexed tweenedSequence store. "${step}" is not a number.`
			);
			return;
		}

		// NOTE: Ignore invalid steps (alternative would be to round, but seems weird)
		if (step > sequence.length - 1 || step < 0) {
			return;
		}

		let nextDuration;
		let nextDelay;

		let partial = fract(step);
		const previousValue: T = sequence[Math.floor(step)] ?? sequence[0];
		const nextValue: T = sequence[Math.ceil(step)] ?? sequence[1];
		const nextFactor = easing!(partial);
		const stepDiff = Math.abs(previousStep - step);
		nextDuration = stepDiff * duration! < duration! ? stepDiff * duration! : duration;
		// TODO: consider delay behavior (when to apply, when not to)
		// maybe as arg to setStep so user can decide?
		nextDelay = stepDiff * delay! < delay! ? stepDiff * delay! : delay;
		const nextVal: T = calculateNextValueFromFract<T>(
			previousValue, // from
			nextValue, // to
			nextFactor
		);
		previousStep = step;
		return set(nextVal, {
			duration: nextDuration ?? duration,
			delay: nextDelay ?? delay,
			easing
		});
	};

	const unsubscribe = step.subscribe(setStep);

	onDestroy(unsubscribe);

	return {
		value,
		step,
		subscribe,
		nextStep: (newOptions) => {
			const baseNext = Math.floor(previousStep + 1);
			// For sequence array, if next idx is too high, use 0
			const actualNext = baseNext > sequence.length - 1 ? 0 : baseNext;
			syncOptions(newOptions);
			return step.set(actualNext);
		},
		previousStep: (newOptions) => {
			const basePrev = Math.ceil(previousStep - 1);
			// For sequence array, if next idx is too high, use 0
			const actualPrev = basePrev < 0 ? sequence.length - 1 : basePrev;
			syncOptions(newOptions);
			return step.set(actualPrev);
		},
		setStep: (s, newOptions) => {
			syncOptions(newOptions);
			step.set(s as number);
		},
		updateSequence: (fn, newOptions) => {
			sequence = fn(sequence) as IndexedSequence<T>;
			syncOptions(newOptions);
			return setStep(previousStep);
		}
	};
}

function createNamedSequence<T>(
	_sequence: NamedSequence<T>,
	options: TweenedSequenceOptions
): TweenedSequence<T> {
	let sequence = _sequence;
	const seqType: SequenceType = 'NAMED';
	let { duration, delay, easing, initialStep: _iStep } = updateOptions(defaultOptions, options);
	let initialStep = (_iStep as string) ?? Object.keys(sequence)[0];

	// Validate initial step
	if (sequence[initialStep] === null || sequence[initialStep] === undefined) {
		console.error(
			`Step "${initialStep}" is an invalid initialStep for your named sequence. A valid step will match one of your sequence keys: ${Object.keys(
				sequence
			).join(', ')}`
		);
	}

	function syncOptions(newOptions: TweenedSequenceOptions | undefined) {
		const updatedOptions = updateOptions({ duration, easing, delay, initialStep }, newOptions);
		duration = updatedOptions.duration;
		easing = updatedOptions.easing;
		delay = updatedOptions.delay;
		initialStep = updatedOptions.initialStep as string;
	}

	const step = writable(initialStep);
	const value = tweened<T>(sequence[initialStep], { duration, easing, delay });
	const { subscribe, set, update } = value;
	let previousStep: string = initialStep;

	function setStep(step: string | number) {
		if (typeof step === 'number' || !sequence.hasOwnProperty(step)) {
			return;
		}

		previousStep = step;
		return set(sequence[step] ?? sequence[initialStep], {
			duration,
			delay,
			easing
		});
	}

	const unsubscribe = step.subscribe(setStep);
	onDestroy(unsubscribe);

	return {
		step,
		value,
		subscribe,
		nextStep: (newOptions) => {
			const keys = Object.keys(sequence);
			const currentIdx = keys.indexOf(previousStep);
			const baseNextKeyIdx = currentIdx + 1;
			const actualNext = keys[baseNextKeyIdx] ?? keys[0];
			syncOptions(newOptions);
			return step.set(actualNext);
		},
		previousStep: (newOptions) => {
			const keys = Object.keys(sequence);
			const currentIdx = keys.indexOf(previousStep as string);
			const basePrevKeyIdx = currentIdx - 1;
			const actualPrev = keys[basePrevKeyIdx] ?? keys[keys.length - 1];
			syncOptions(newOptions);
			return step.set(actualPrev);
		},
		setStep: (s, newOptions) => {
			syncOptions(newOptions);
			step.set(s as string);
		},
		updateSequence: (fn, newOptions) => {
			sequence = fn(sequence) as NamedSequence<T>;
			syncOptions(newOptions);
			return setStep(previousStep);
		}
	};
}

export function tweenedSequence<T>(sequence: Sequence<T>, options: TweenedSequenceOptions = {}) {
	const seqType: SequenceType = Array.isArray(sequence) ? 'INDEXED' : 'NAMED';
	if (seqType === 'INDEXED') {
		return createIndexedSequence<T>(sequence as IndexedSequence<T>, options);
	} else {
		// (seqType === 'NAMED')
		return createNamedSequence<T>(sequence as NamedSequence<T>, options);
	}
}
