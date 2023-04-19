<script lang="ts">
	import type { TweenedSequenceOptions } from '$lib/models';
	import { tweenedSequence } from '$lib/tweenedSequence';
	import { quintOut, elasticOut, circOut, sineInOut } from 'svelte/easing';
	import type { EasingFunction } from 'svelte/transition';

	const easingFns: EasingFunction[] = [quintOut, elasticOut, circOut, sineInOut];
  let options = {
		duration: 1000,
		easing: quintOut.name
	}
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

  function randomOptions(): TweenedSequenceOptions {
    const opts = {
      duration: Number((Math.random() * 3000 + 200).toFixed()),
      easing: easingFns[Math.floor(Math.random() * easingFns.length)]
    }
    options = {
      ...opts,
      easing: opts.easing.name
    };
    return opts;
  }

	function handlePartialWithRandomOpts(evt: any){
		positionSequence.setStep((evt.target as HTMLInputElement).valueAsNumber, randomOptions());
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

<div class="range-box">
	<label
		>Partial Step:
		<input type="range" step="0.01" min="0" max={positionList.length - 1} bind:value={$step} />
	</label>
</div>
<div class="range-box">
	<label
		>Partial Step w/ Options Update:
		<input type="range" step="0.01" min="0" max={positionList.length - 1} value={$step} on:change={handlePartialWithRandomOpts} />
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
