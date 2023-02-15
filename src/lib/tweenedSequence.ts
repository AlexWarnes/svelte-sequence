import { tweened } from 'svelte/motion';
import { linear } from 'svelte/easing';
import type {
	IndexedSequence,
	NamedSequence,
	Sequence,
	SequenceType,
	TweenedSequence,
	TweenedSequenceOptions,
} from './models';
import { derived, readable, writable } from 'svelte/store';
// import { get } from 'svelte/store';

function calculateNextValueFromFract<T>(
	a: T,
	b: T,
	factor: number
): T | undefined {
	if (typeof a === 'number' && typeof b === 'number') {
		// handle numbers
		return (b - a) * factor + a as T;
	}

	if (Array.isArray(a) && Array.isArray(b)) {
		// handle arrays
		const temp = [...a];
		a.forEach((val, idx) => {
			temp[idx] = (b[idx] - val) * factor + val;
		});
		return temp as T;
	}

  if (!!a && !!b && typeof a === "object" && typeof b === "object"){
    // handle objects (like Vector3)
    const temp = {};
    Object.keys(a).forEach((k) => {
      // TODO
      // @ts-ignore
      temp[k] = ((b[k] as number) - (a[k] as number)) * factor + (a[k] as number);
    })
    return temp as T;
  }
}

function getInitialStepKeyFromSequence<T>(sequence: Sequence<T>, seqType: SequenceType): string | number {
	if (seqType === 'NAMED') {
		return Object.keys(sequence)[0];
	}

	return 0;
}
function createSequence<T>(
	sequence: Sequence<T>,
	options: TweenedSequenceOptions
): TweenedSequence<T> {
	const seqType: SequenceType = Array.isArray(sequence) ? 'INDEXED' : 'NAMED';
	const duration = options.duration ?? 1000;
	const easing = options.easing ?? linear;
	const delay = options.delay ?? 0;
	const initialStep =
		options.initialStep ?? (getInitialStepKeyFromSequence(sequence, seqType) as number | string);
	// TODO
	// @ts-ignore
	const { subscribe, set } = tweened<T>(sequence[initialStep], { duration, easing, delay });
	let previousStep: number | string = initialStep;
	const fract = (num: number) => num % 1.0;

	return {
		subscribe,
		setStep: (step: number | string) => {
			if (seqType === 'NAMED' && !(sequence as NamedSequence<T>).hasOwnProperty(step)) {
				return;
			}

			if (seqType === 'INDEXED') {
				if (typeof step !== 'number') {
					console.error(
						`Step "${step}" is not assignable to an indexed tweenedSequence store. "${step}" is not a number.`
					);
					return;
				}

				if (step > (sequence as IndexedSequence<T>).length - 1 || step < 0) {
					return;
				}
			}

			let nextDuration;
			let nextDelay;

			if (seqType === 'INDEXED' && typeof step === 'number') {
				let partial = fract(step);
				// TODO
				// @ts-ignore
				const previous: number = sequence[Math.floor(step)] ?? sequence[0];
				// TODO
				// @ts-ignore
				const next: number = sequence[Math.ceil(step)] ?? sequence[1];
				const nextFactor = easing(partial);
				const stepDiff = Math.abs((previousStep as number) - step);
				nextDuration = stepDiff * duration < duration ? stepDiff * duration : duration;
				// TODO: consider delay behavior (when to apply, when not to)
				// maybe as arg to setStep so user can decide?
				nextDelay = stepDiff * delay < delay ? stepDiff * delay : delay;
				const nextVal = calculateNextValueFromFract<T>(
					previous as T, // from
					next as T, // to
					nextFactor
				);
				previousStep = step;
				set(nextVal as T, {
					duration: nextDuration ?? duration,
					delay: nextDelay ?? delay,
					easing
				});
				return;
			}

			if (seqType === 'NAMED') {
				// TODO
				// @ts-ignore
				set(sequence[step] ?? sequence[initialStep], {
					duration: nextDuration ?? duration,
					delay: nextDelay ?? delay,
					easing
				});
			}
		}
	};
}

// TODO: Optional type arg for named keys
export function tweenedSequence<T>(sequence: Sequence<T>, options: TweenedSequenceOptions = {}) {
	return createSequence<T>(sequence, options);
}
