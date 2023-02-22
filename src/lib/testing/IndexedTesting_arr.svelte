<script lang="ts">
	import { tweenedSequence } from '$lib/tweenedSequence';
	import { elasticOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';

	let step: number = 0;
	const positionList: [number, number][] = [
		[0, 0],
		[250, 10],
		[400, 125],
		[10, 325],
		[490, 490]
	];

	$: positionSequence.setStep(1);

	const positionSequence = tweenedSequence<[number, number]>(positionList, {
		duration: 1000,
		easing: elasticOut
	});

	positionSequence.setStep(1)
</script>

<div class="wrapper">
	<div class="dot" style:left="{$positionSequence[0]}px" style:top="{$positionSequence[1]}px" />
</div>

<button on:click={() => positionSequence.previousStep()}>Previous</button>
<button on:click={() => positionSequence.setStep(0)}>0</button>

<button on:click={() => positionSequence.setStep(1)}>1</button>

<button on:click={() => positionSequence.setStep(2)}>2</button>

<button on:click={() => positionSequence.setStep(3)}>3</button>

<button on:click={() => positionSequence.setStep(4)}>4</button>
<button on:click={() => positionSequence.nextStep()}>Next</button>
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
