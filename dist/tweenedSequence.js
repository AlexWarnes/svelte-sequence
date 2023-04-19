import { tweened } from 'svelte/motion';
import { linear } from 'svelte/easing';
import { writable } from 'svelte/store';
import { onDestroy } from 'svelte';
const defaultOptions = {
    duration: 1000,
    easing: linear,
    delay: 0
};
function calculateNextValueFromFract(a, b, factor) {
    if (typeof a === 'number' && typeof b === 'number') {
        // handle numbers
        return ((b - a) * factor + a);
    }
    if (Array.isArray(a) && Array.isArray(b)) {
        // handle arrays
        const temp = [...a];
        a.forEach((val, idx) => {
            temp[idx] = (b[idx] - val) * factor + val;
        });
        return temp;
    }
    // TODO: See if this even works to handle threejs vector3
    // @ts-ignore
    if (a.isVector3 && b.isVector3) {
        // handle threejs vector3
        const v3 = a
            .clone()
            .setX((b['x'] - a['x']) * factor +
            a['x'])
            .setY((b['y'] - a['y']) * factor +
            a['y'])
            .setZ((b['z'] - a['z']) * factor +
            a['z']);
        return v3;
    }
    if (!!a && !!b && typeof a === 'object' && typeof b === 'object') {
        // handle objects
        const temp = {};
        Object.keys(a).forEach((k) => {
            // TODO
            // @ts-ignore
            temp[k] = (b[k] - a[k]) * factor + a[k];
        });
        return temp;
    }
    return b;
}
function updateOptions(currentOptions, newOptions) {
    if (!newOptions)
        return currentOptions;
    let duration = newOptions.duration ?? currentOptions.duration;
    let easing = newOptions.easing ?? currentOptions.easing;
    let delay = newOptions.delay ?? currentOptions.delay;
    let initialStep = newOptions.initialStep ?? currentOptions.initialStep;
    return { duration, easing, delay, initialStep };
}
function createIndexedSequence(_sequence, options) {
    let sequence = _sequence;
    const seqType = 'INDEXED';
    let { duration, delay, easing, initialStep: _iStep } = updateOptions(defaultOptions, options);
    let initialStep = _iStep ?? 0;
    // Validate initial step
    if (initialStep < 0 || initialStep > sequence.length) {
        console.error(`Step "${initialStep}" is an invalid initialStep for your sequence of length ${sequence.length}. A valid step satisfies: 0 <= step <= ${sequence.length - 1}`);
    }
    function syncOptions(newOptions) {
        const updatedOptions = updateOptions({ duration, easing, delay, initialStep }, newOptions);
        duration = updatedOptions.duration;
        easing = updatedOptions.easing;
        delay = updatedOptions.delay;
        initialStep = updatedOptions.initialStep;
    }
    const step = writable(initialStep);
    const value = tweened(sequence[initialStep], { duration, easing, delay });
    const { subscribe, set, update } = value;
    let previousStep = initialStep;
    // lil fractional helper
    const fract = (num) => num % 1.0;
    const setStep = (step) => {
        if (typeof step !== 'number') {
            console.error(`Step "${step}" is not assignable to an indexed tweenedSequence store. "${step}" is not a number.`);
            return;
        }
        // NOTE: Ignore invalid steps (alternative would be to round, but seems weird)
        if (step > sequence.length - 1 || step < 0) {
            return;
        }
        let nextDuration;
        let nextDelay;
        let partial = fract(step);
        const previousValue = sequence[Math.floor(step)] ?? sequence[0];
        const nextValue = sequence[Math.ceil(step)] ?? sequence[1];
        const nextFactor = easing(partial);
        const stepDiff = Math.abs(previousStep - step);
        nextDuration = stepDiff * duration < duration ? stepDiff * duration : duration;
        // TODO: consider delay behavior (when to apply, when not to)
        // maybe as arg to setStep so user can decide?
        nextDelay = stepDiff * delay < delay ? stepDiff * delay : delay;
        const nextVal = calculateNextValueFromFract(previousValue, // from
        nextValue, // to
        nextFactor);
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
            step.set(s);
        },
        updateSequence: (fn, newOptions) => {
            sequence = fn(sequence);
            syncOptions(newOptions);
            return setStep(previousStep);
        }
    };
}
function createNamedSequence(_sequence, options) {
    let sequence = _sequence;
    const seqType = 'NAMED';
    let { duration, delay, easing, initialStep: _iStep } = updateOptions(defaultOptions, options);
    let initialStep = _iStep ?? Object.keys(sequence)[0];
    // Validate initial step
    if (sequence[initialStep] === null || sequence[initialStep] === undefined) {
        console.error(`Step "${initialStep}" is an invalid initialStep for your named sequence. A valid step will match one of your sequence keys: ${Object.keys(sequence).join(', ')}`);
    }
    function syncOptions(newOptions) {
        const updatedOptions = updateOptions({ duration, easing, delay, initialStep }, newOptions);
        duration = updatedOptions.duration;
        easing = updatedOptions.easing;
        delay = updatedOptions.delay;
        initialStep = updatedOptions.initialStep;
    }
    const step = writable(initialStep);
    const value = tweened(sequence[initialStep], { duration, easing, delay });
    const { subscribe, set, update } = value;
    let previousStep = initialStep;
    function setStep(step) {
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
            const currentIdx = keys.indexOf(previousStep);
            const basePrevKeyIdx = currentIdx - 1;
            const actualPrev = keys[basePrevKeyIdx] ?? keys[keys.length - 1];
            syncOptions(newOptions);
            return step.set(actualPrev);
        },
        setStep: (s, newOptions) => {
            syncOptions(newOptions);
            step.set(s);
        },
        updateSequence: (fn, newOptions) => {
            sequence = fn(sequence);
            syncOptions(newOptions);
            return setStep(previousStep);
        }
    };
}
export function tweenedSequence(sequence, options = {}) {
    const seqType = Array.isArray(sequence) ? 'INDEXED' : 'NAMED';
    if (seqType === 'INDEXED') {
        return createIndexedSequence(sequence, options);
    }
    else {
        // (seqType === 'NAMED')
        return createNamedSequence(sequence, options);
    }
}
