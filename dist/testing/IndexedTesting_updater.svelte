<script>import { tweenedSequence } from "../tweenedSequence";
import { quintOut } from "svelte/easing";
const positionList = [
  [0, 0],
  [250, 10],
  [400, 125],
  [10, 325],
  [490, 490]
];
const buttons = positionList.map((_, idx) => idx);
const positionSequence = tweenedSequence(positionList, {
  duration: 1e3,
  easing: quintOut
});
const { step } = positionSequence;
let x0 = 0;
let y0 = 0;
$:
  positionSequence.updateSequence((current) => {
    current[0] = [x0, y0];
    return current;
  });
</script>

<div class="wrapper">
	<div class="dot" style:left="{$positionSequence[0]}px" style:top="{$positionSequence[1]}px" />
</div>

<div class="control-box">
	<button on:click={() => positionSequence.previousStep()}>Previous</button>
	{#each buttons as b}
		<button class:active={$step === b} on:click={() => positionSequence.setStep(b)}>{b}</button>
	{/each}
	<button on:click={() => positionSequence.nextStep()}>Next</button>
</div>

<div class="range-box">
	<label
		>Sequence[0][0] (x): {x0.toFixed(1)}
		<input type="range" bind:value={x0} min="0" max="500" step="0.5" />
	</label>
	<label
		>Sequence[0][1] (y): {y0.toFixed(1)}
		<input type="range" bind:value={y0} min="0" max="500" step="0.5" />
	</label>
</div>

<style>
	.wrapper {
		background-color: steelblue;
		width: 500px;
		height: 500px;
		position: relative;
	}

	.dot {
		width: 1rem;
		height: 1rem;
		border-radius: 50%;
		background-color: salmon;
		position: absolute;
	}

	label {
		display: block;
	}
</style>
