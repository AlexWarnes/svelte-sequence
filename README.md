# svelte-sequence

Custom stores to compose tweened motion sequences over multiple steps.

- `tweenedSequence` to compose tweened motion sequences over multiple steps
- `stopwatch` to create an instance of a stopwatch
- `timer` to create an instance of a timer

**Installation:**
`npm i -D svelte-sequence`

Example on StackBlitz: https://stackblitz.com/edit/example-svelte-sequence

# tweenedSequence

**Methods:**

- `setStep(step, options?)`
- `updateSequence((currentSequence) => newSequence, options?)`
- `nextStep(options?)`
- `previousStep(options?)`

**Stores:**
- `value: Tweened<T>`
- `step: Writable<string | number>`


## **Usage**

Imagine you have an object on screen. You want this object to move to specific points as a user clicks through some awesome tutorial you made. Your tutorial has four steps.

1. Create a `tweenedSequence` store. Provide it with your sequence of values at each step:

```js
const sequence = {
	step_one: { x: 0, y: 0 },
	step_two: { x: 10, y: 5 },
	step_three: { x: 15, y: 10 },
	step_four: { x: 50, y: 25 }
};

const myPosition = tweenedSequence(sequence, { initialStep: 'step_one' });
```

2. The `myPosition` store you created will emit the `{ x, y }` values based on the step you set. Use your sequence keys to update the step and consume the new `{ x, y }` values:

```js
// will tween from current value to 'step_two' value
myPosition.setStep('step_two');
```

And somewhere in your template you could:

```svelte
<div class="dot" style:left="{$myPosition['x']}px" style:top="{$myPosition['y']}px" />
```

## **tweenedSequence Args**

`tweenedSequence(sequence, options)`

### **sequence**

A `tweenedSequence` accepts a sequence as objects or arrays.

**Named Sequence (objects)**

Each key in your named sequence corresponds to a step. You can call `setStep(name)` for any key in the provided sequence.

If you call `setStep()` with a name that is not present in a sequence, nothing will happen. This allows for flexible step coordination between objects without errors getting thrown or unwanted movement.

Named Sequence _values_ can be anything a regular tweened store accepts (number, array, object). The values must be the same "shape" across steps.

```js
const namedSequence_number = {
	step_one: 0,
	step_two: 8
	// ...
};

const namedSequence_array = {
	step_one: [0, 0],
	step_two: [8, 14]
	// ...
};

const namedSequence_object = {
	step_one: { x: 0, y: 0 },
	step_two: { x: 8, y: 14 }
	// ...
};
```

**Indexed Sequence (arrays)**

Each index in your indexed sequence corresponds to a step. You can call `setStep(index)` for any index in the provided sequence.

If you call `setStep()` with a fractional value that exists in the sequence, you'll receive the value at that fractional point in the tween based on your provided easing. This allows for "scrubbing" through your motion.

For example, `setStep(1.5)` will emit the value halfway between index 1 and index 2 in the sequence you provided.

Indexed Sequence _values_ can be anything a regular tweened store accepts (number, array, object). The values must be the same "shape" across steps.

```js
const indexedSequence_number = [0, 8];

const indexedSequence_array = [
	[0, 0],
	[8, 14]
	// ...
];

const indexedSequence_object = [
	{ x: 0, y: 0 },
	{ x: 8, y: 14 }
	// ...
];
```

**Step Binding**

You can also bind directly to `step` which is returned from `tweenedSequence`. Combine this with a range slider for easy scrubbing:

```js
const myPosition = tweenedSequence(indexedSequence_array);
const { step } = myPosition;
```

And in your template:

```svelte
<label>Scrubber: {$step.toFixed(2)}
	<input type="range" bind:value={$step} step="0.01" min="0" max={indexedSequence_array - 1} />
</label>
```

### **options**

Similar to regular tweened stores, the `tweenedSequence` options accept the following optional properties:

```js
const options = {
	duration: 400, // number, ms
	easing: linear, // any easing fn from svelte/easing
	delay: 0, // number, ms
	initialStep: 0 // the initial step of your sequence (name or index)
};
```

## **updateSequence()**

If your sequence changes for some reason, you may need to update parts of it.

For example an object moves to four positions, but the third position is determined by user click.

```js
function handleClick(event) {
	mySequence.updateSequence((current) => {
		// index 2 is the third item in the sequence
		current[2] = [event.clientX, event.clientY];
		return current;
	});
}
```

And voila! Your sequence is updated and your call to `setStep(2)` will tween to your new tuple position. This works for any sequence type or value type, as long as the returned sequence is the same shape as the original.

## **Dynamic Options**

Also similar to a tweened sotre, you can update your options (like delay, easing, or duration) with an optional second argument to any of your `setStep`, `previousStep`, `nextStep`, or `updateSequence` calls.

For example:
```js
function elasticNext(){
	mySequence.nextStep({ easing: elasticOut, duration: 3000 });
}

function cubicPrevious(){
	mySequence.previousStep({ easing: cubicInOut, duration: 800 });
}

```
# stopwatch

A stopwatch store that emits time elapsed in ms.

**Methods:**

- `start()`
- `pause()`
- `reset()`
- `addLap()`

**properties:**

- `laps: Writable<Lap[]>` - a store with an array of registered laps

**Usage**
Create a new stopwatch:

```js
const firstStopwatch = stopwatch();
```

Invoke any of the methods:

```js
firstStopwatch.start();
firstStopwatch.pause();
firstStopwatch.reset();
firstStopwatch.addLap();
```

Extract and read the laps as needed:

```svelte
<script>
//...
const { laps } = firstStopwatch;

</script>

{#each $laps as lap (lap.lapNumber)}
  <LapDisplay {lap}>
{/each}
```

## Timer

A stopwatch store that emits time elapsed in ms.

**method:**

- `start()`
- `pause()`
- `reset()`
- `add(time, timeUnit = 'ms')`

**Usage**
Create a new timer:
```js
// Creates a timer of 10000 ms
const firstTimer = timer(10000);

// Creates a timer of 1.5 hours
const secondTimer = timer(1.5, 'h');
```
**NOTE:** timers will always emit their value in ms, regardless of how you initialize them. There are a handful of time utils exported to help with common time parsing.

Invoke any of the methods:

```js
firstTimer.start();
firstTimer.pause();
firstTimer.reset();

// adds 60 seconds to the timer, useful for "snooze" scenarios
firstTimer.add(60, 's');
```

## Time Utils
```ts
// Converts ms to Seconds
function getSeconds(ms: number) {
	return Math.floor(ms / 1000);
}
// Converts ms to Minutes
function getMinutes(ms: number) {
	return Math.floor(ms / minMS);
}
// Converts ms to Hours
function getHours(ms: number) {
	return Math.floor(ms / hourMS);
}
// Converts ms to Days
function getDays(ms: number) {
	return Math.floor(ms / dayMS);
}
// Converts ms to Weeks
function getWeeks(ms: number) {
	return Math.floor(ms / weekMS);
}

// Converts ms (t) into constituent units of time, returned as an array
function formatTime(t: number, includeZero: boolean = false) {
	const { wk, d, h, m, s } = extractUnits(t);
	const timeList = [
		{ time: wk, unit: wk === 1 ? 'week' : 'weeks', shortUnit: 'wk' },
		{ time: d, unit: d === 1 ? 'day' : 'days', shortUnit: 'd' },
		{ time: h, unit: h === 1 ? 'hour' : 'hours', shortUnit: 'hr' },
		{ time: m, unit: m === 1 ? 'minute' : 'minutes', shortUnit: 'min' },
		{ time: s / 1000, unit: s === 1 ? 'second' : 'seconds', shortUnit: 's' }
	];
	if (includeZero) {
		return timeList;
	} else {
		return timeList.filter((tData) => tData.time > 0);
	}
}
```

## Types

```ts
interface TweenedSequence<T> extends Readable<T> {
	value: Tweened<T>,
	step: Writable<string | number>;
	setStep: (step: string | number, options?: TweenedSequenceOptions) => void;
	nextStep: (options?: TweenedSequenceOptions) => void;
	previousStep: (options?: TweenedSequenceOptions) => void;
	// PRs welcome :D
	updateSequence: (fn: (currentSequence: any) => any, options?: TweenedSequenceOptions) => void;
}

interface TweenedSequenceOptions {
	duration?: number;
	delay?: number;
	easing?: (t: number) => number;
	initialStep?: number | string;
}

interface Lap {
	lapNumber: number;
	lapTime: number;
	totalTime: number;
	delta: number;
}

type TimeUnit = 'ms' | 's' | 'm' | 'h' | 'd' | 'w';
```

## Roadmap

- Better type support
- Add function metadata for better dx
