<script lang="ts">
	import type { TweenedSequence } from '$lib/models';
	import { tweenedSequence } from '$lib/tweenedSequence';
	import { elasticOut } from 'svelte/easing';

	let step = 0;
	const positionList: number[] = [0, 10, 125, 325, 490];

	$: positionSequence.setStep(step);

	//@ts-ignore
	const positionSequence: TweenedSequence<number> = tweenedSequence(positionList, {
		duration: 1000,
		easing: elasticOut
	});
</script>

<div class="wrapper">
	<div class="dot" style:left="{$positionSequence}px" style:top="{$positionSequence}px" />
</div>

<button on:click={() => positionSequence.setStep(0)}>0</button>

<button on:click={() => positionSequence.setStep(1)}>1</button>

<button on:click={() => positionSequence.setStep(2)}>2</button>

<button on:click={() => positionSequence.setStep(3)}>3</button>

<button on:click={() => positionSequence.setStep(4)}>4</button>
<label
	>Partial Step:
	<input type="range" step="0.01" min="0" max={positionList.length - 1} bind:value={step} />
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
