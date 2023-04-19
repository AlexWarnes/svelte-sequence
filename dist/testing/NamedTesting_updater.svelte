<script>import { tweenedSequence } from "../tweenedSequence";
import { quintOut } from "svelte/easing";
let Step_One = { x: 0, y: 0 };
const positionList = {
  Step_One,
  Step_Two: { x: 250, y: 10 },
  Step_Three: { x: 400, y: 125 },
  Step_Four: { x: 10, y: 325 },
  Step_Five: { x: 490, y: 490 }
};
const buttons = Object.keys(positionList);
const positionSequence = tweenedSequence(positionList, {
  duration: 1e3,
  easing: quintOut
});
const { step } = positionSequence;
$:
  positionSequence.updateSequence((current) => {
    current.Step_One = Step_One;
    return current;
  });
</script>

<div class="wrapper">
	<div class="dot" style:left="{$positionSequence['x']}px" style:top="{$positionSequence['y']}px" />
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
		>Step_One X: {Step_One.x.toFixed(1)}
		<input type="range" bind:value={Step_One.x} min="0" max="500" step="0.5" />
	</label>
	<label
		>Step_One Y: {Step_One.y.toFixed(1)}
		<input type="range" bind:value={Step_One.y} min="0" max="500" step="0.5" />
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
</style>
