<script lang="ts">
	import { tweenedSequence } from '$lib/tweenedSequence';
	import { elasticOut } from 'svelte/easing';

	const positionList: [number, number][] = [
		[0, 0],
		[250, 10],
		[400, 125],
		[10, 325],
		[490, 490]
	];
	const buttons = positionList.map((_, idx) => idx);

	const positionSequence = tweenedSequence<[number, number]>(positionList, {
		duration: 1000,
		easing: elasticOut
	});
	const { step } = positionSequence;

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
		>Partial Step:
		<input type="range" step="0.01" min="0" max={positionList.length - 1} bind:value={$step} />
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
	input[type='range'] {
		width: 300px;
	}
</style>
