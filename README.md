# svelte-sequence

Custom stores to compose tweened motion sequences over multiple steps.

`npm i -D svelte-sequence`

Example on StackBlitz: https://stackblitz.com/edit/example-svelte-sequence

## Getting Started

Imagine you have an object on screen. You want this object to move to specific points as a user clicks through some awesome tutorial you made. Your tutorial has four steps.

1. Create a `tweenedSequence` store. Provide it with your sequence of values at each step:

```js
const sequence = {
  step_one: {x: 0, y: 0},
  step_two: {x: 10, y: 5},
  step_three: {x: 15, y: 10},
  step_four: {x: 50, y: 25},
}

const myPosition = tweenedSequence(sequence, { initialStep: "step_one" });
```

2. The `myPosition` store you created will emit the `{ x, y }` values based on the step you set. Use your sequence keys to update the step and consume the new `{ x, y }` values:

```js
// will tween from current value to 'step_two' value
myPosition.setStep('step_two');
```

And somewhere in your template you could:

```html
<div 
  class="dot" 
  style:left="{$myPosition['x']}px" 
  style:top="{$myPosition['y']}px" 
/>
```

## tweenedSequence Args
`tweenedSequence(sequence, options)`

### sequence
A `tweenedSequence` accepts objects or arrays.

**Named Sequence (objects)**
Each key in your named sequence corresponds to a step. You can call `setStep(name)` for any key in the provided sequence.

If you call `setStep()` with a name that is not present in a sequence, nothing will happen. This allows for flexible step coordination between objects without errors getting thrown or unwanted movement.

Named Sequence _values_ can be anything a regular tweened store accepts (number, array, object). The values must be the same "shape" across steps.

```js
const namedSequence_number = {
  step_one: 0,
  step_two: 8,
  // ...
}

const namedSequence_array = {
  step_one: [0, 0],
  step_two: [8, 14],
  // ...
}

const namedSequence_object = {
  step_one: { x: 0, y: 0 },
  step_two: { x: 8, y: 14 },
  // ...
}
```

**Indexed Sequence (arrays)**
Each index in your indexed sequence corresponds to a step. You can call `setStep(index)` for any index in the provided sequence.

If you call `setStep()` with a fractional value that exists in the sequence, you'll receive the value at that point in the tween based on your provided easing. This allows for "scrubbing" through your motion.

Indexed Sequence _values_ can be anything a regular tweened store accepts (number, array, object). The values must be the same "shape" across steps.

```js
const indexedSequence_number = [0, 8]

const indexedSequence_array = [
  [0, 0],
  [8, 14],
  // ...
]

const indexedSequence_object = [
  { x: 0, y: 0 },
  { x: 8, y: 14 },
  // ...
]
```

## Roadmap
- Better type support
