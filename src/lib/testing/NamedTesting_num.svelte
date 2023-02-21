<script lang="ts">
	import type { TweenedSequence } from '$lib/models';
	import { tweenedSequence } from '$lib/tweenedSequence';
	import { quintOut } from 'svelte/easing';

	const positionList: number[] = [0, 10, 125, 325, 490];

	const buttons = positionList.map((_, idx) => idx);

	const positionSequence: TweenedSequence<number> = tweenedSequence(positionList, {
		duration: 1000,
		easing: quintOut
	});
</script>

<div class="wrapper">
	<div class="dot" style:left="{$positionSequence}px" />
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
		height: 0.5rem;
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
