<script lang="ts">
	import type { TweenedSequence, Vector2 } from '$lib/models';
	import { tweenedSequence } from '$lib/tweenedSequence';
	import { elasticOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';

	const positionList: Partial<Vector2>[] = [
		{ x: 0, y: 0 },
		{ x: 250, y: 10 },
		{ x: 400, y: 125 },
		{ x: 10, y: 325 },
		{ x: 490, y: 490 }
	];

	const buttons = positionList.map((_, idx) => idx);

	//@ts-ignore
	// const positionSequence: TweenedSequence<Vector2> = tweenedSequence(positionList, {
	// 	duration: 1000,
	// 	easing: elasticOut
	// });
	const { value, step, setStep, previousStep, nextStep } = tweenedSequence(positionList, {
		duration: 1000,
		easing: elasticOut
	});
</script>

<div class="wrapper">
	<div class="dot" style:left="{$value['x']}px" style:top="{$value['y']}px" />
</div>

<div class="control-box">
	<button on:click={() => previousStep()}>Previous</button>
	{#each buttons as b}
		<button class:active={$step === b} on:click={() => setStep(b)}>{b}</button>
	{/each}
	<button on:click={() => nextStep()}>Next</button>
</div>
<label
	>Partial Step:
	<input type="range" step="0.01" min="0" max={positionList.length - 1} bind:value={$step} />
</label>

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
