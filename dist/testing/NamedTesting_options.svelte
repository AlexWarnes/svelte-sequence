<script>import { tweenedSequence } from "../tweenedSequence";
import { quintOut, elasticOut, circOut, sineInOut } from "svelte/easing";
const easingFns = [quintOut, elasticOut, circOut, sineInOut];
let options = {
  duration: 1e3,
  easing: quintOut.name
};
const positionList = {
  first: [0, 0],
  second: [250, 10],
  third: [400, 125],
  fourth: [10, 325],
  fifth: [490, 490]
};
const buttons = Object.keys(positionList);
const positionSequence = tweenedSequence(positionList, {
  duration: 1e3,
  easing: quintOut
});
const { step } = positionSequence;
function randomOptions() {
  const opts = {
    duration: Number((Math.random() * 3e3 + 200).toFixed()),
    easing: easingFns[Math.floor(Math.random() * easingFns.length)]
  };
  options = {
    ...opts,
    easing: opts.easing.name
  };
  return opts;
}
</script>

<div class="wrapper">
	<div class="dot" style:left="{$positionSequence[0]}px" style:top="{$positionSequence[1]}px" />
  <pre>{JSON.stringify(options, null, 2)}</pre>
</div>

<div class="control-box">
	<button on:click={() => positionSequence.previousStep(randomOptions())}>Previous</button>
	{#each buttons as b}
		<button class:active={$step === b} on:click={() => positionSequence.setStep(b, randomOptions())}>{b}</button>
	{/each}
	<button on:click={() => positionSequence.nextStep(randomOptions())}>Next</button>
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
