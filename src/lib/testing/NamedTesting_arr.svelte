<script lang="ts">
	import type { TweenedSequence } from '$lib/models';
	import { tweenedSequence } from '$lib/tweenedSequence';
	import { quintOut } from 'svelte/easing';

	const positionList: [number, number][] = [
		[0, 0],
		[250, 10],
		[400, 125],
		[10, 325],
		[490, 490]
	];

	const buttons = positionList.map((_, idx) => idx);

	const positionSequence: TweenedSequence<[number, number]> = tweenedSequence(positionList, {
		duration: 1000,
		easing: quintOut
	});
</script>

<div class="wrapper">
	<div class="dot" style:left="{$positionSequence[0]}px" style:top="{$positionSequence[1]}px" />
</div>

<button on:click={() => positionSequence.previousStep()}>Previous</button>
{#each buttons as b}
	<button on:click={() => positionSequence.setStep(b)}>{b}</button>
{/each}
<button on:click={() => positionSequence.nextStep()}>Next</button>

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
