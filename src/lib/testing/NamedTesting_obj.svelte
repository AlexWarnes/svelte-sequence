<script lang="ts">
	import type { TweenedSequence, v2 } from '$lib/models';
	import { tweenedSequence } from '$lib/tweenedSequence';
	import { quintOut } from 'svelte/easing';

	// TODO: Fix issue where interface like this throws error because 
	// not indexed with [key: string] in NamedSequence.

	// interface NamedPositionList {
	// 	Step_One: v2;
	// 	Step_Two: v2;
	// 	Step_Three: v2;
	// 	Step_Four: v2;
	// 	Step_Five: v2;
	// }

	// Temporary "solution" is to use type

	type NamedPositionList = {
		Step_One: v2;
		Step_Two: v2;
		Step_Three: v2;
		Step_Four: v2;
		Step_Five: v2;
	}

	const positionList: NamedPositionList = {
		Step_One: { x: 0, y: 0 },
		Step_Two: { x: 250, y: 10 },
		Step_Three: { x: 400, y: 125 },
		Step_Four: { x: 10, y: 325 },
		Step_Five: { x: 490, y: 490 }
	};

	const buttons = Object.keys(positionList);

	const positionSequence = tweenedSequence<v2>(positionList, {
		duration: 1000,
		easing: quintOut
	});
</script>

<div class="wrapper">
	<div class="dot" style:left="{$positionSequence['x']}px" style:top="{$positionSequence['y']}px" />
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
