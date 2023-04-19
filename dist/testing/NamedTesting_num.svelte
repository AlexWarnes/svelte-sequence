<script>import { tweenedSequence } from "../tweenedSequence";
import { quintOut } from "svelte/easing";
const positionList = {
  first: 0,
  second: 10,
  third: 125,
  fourth: 325,
  fifth: 490
};
const buttons = Object.keys(positionList);
const positionSequence = tweenedSequence(positionList, {
  duration: 1e3,
  easing: quintOut
});
const { value, step } = positionSequence;
</script>

<div class="wrapper">
	<div class="dot" style:left="{$value}px" />
</div>

<div class="control-box">
	<button on:click={() => positionSequence.previousStep()}>Previous</button>
	{#each buttons as b}
	<button class:active={$step === b} on:click={() => positionSequence.setStep(b)}>{b}</button>
	{/each}
	<button on:click={() => positionSequence.nextStep()}>Next</button>
</div>

<style>
	.wrapper {
		background-color: steelblue;
		width: 500px;
		height: 1rem;
    position: relative;
    border-radius: 1.25rem;
	}

	.dot {
		width: 1rem;
		height: 1rem;
		border-radius: 50%;
		background-color: salmon;
		position: absolute;
		bottom: 0;
	}

</style>
