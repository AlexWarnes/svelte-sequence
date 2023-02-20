<script lang="ts">
	import { stopwatch } from '$lib/stopwatch';
	import { timer } from '$lib/timer';
	import { formatTime, getDays, getHours, getMinutes, getSeconds } from '$lib/timeUtils';
	import { scale } from 'svelte/transition';

	const sw = stopwatch();
	const laps = sw.laps;
	const sTimer = timer(15, 'seconds');
	const customTimer = timer(1, 'days');
</script>

<h1>TIME STORES</h1>
<h2>Stopwatch</h2>
<p class="tab">{($sw / 1000).toFixed(2)}</p>
<div class="lap-container">
	{#each $laps as lap (lap.lapNumber)}
		<div class="lap-box" in:scale>
			<p><strong>LAP {lap.lapNumber}</strong></p>
			<p>
				<span>{(lap.lapTime / 1000).toFixed(2)}</span>
				<span style:color={lap.delta > 0 ? 'red' : 'green'}>
					({lap.delta > 0 ? '+' : ''}{(lap.delta / 1000).toFixed(2)})
				</span>
			</p>
			<p>Elapsed: {(lap.totalTime / 1000).toFixed(2)}</p>
		</div>
	{/each}
</div>
<button on:click={() => sw.start()}> start </button>
<button on:click={() => sw.addLap()}> lap </button>
<button on:click={() => sw.pause()}> pause </button>
<button on:click={() => sw.reset()}> reset </button>

<h2>Timer</h2>
<p class="tab">{getSeconds($sTimer)}s</p>
<pre>{JSON.stringify(formatTime($sTimer), null, 2)}</pre>
<button on:click={() => sTimer.start()}> start </button>
<button on:click={() => sTimer.pause()}> pause </button>
<button on:click={() => sTimer.reset()}> reset </button>
<button on:click={() => sTimer.add(10000)}> snooze 10s </button>
<p class="tab">{getDays($customTimer)} days</p>
<p class="tab">{getHours($customTimer)} hours</p>
<p class="tab">{getMinutes($customTimer)} minutes</p>
<p class="tab">{getSeconds($customTimer)} seconds</p>
{#each formatTime($customTimer, true) as t}
	<span class="tab" style="display: inline-block; width: 3rem;">{t.time}{t.shortUnit}</span>
{/each}
<button on:click={() => customTimer.start()}> start </button>
<button on:click={() => customTimer.pause()}> pause </button>
<button on:click={() => customTimer.reset()}> reset </button>
<button on:click={() => customTimer.add(10000)}> snooze 10s </button>

<style>
	.tab {
		font-variant-numeric: tabular-nums;
	}

	.lap-container {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-flow: wrap row;
		gap: 1rem;
		min-height: 4rem;
    margin: 0 0 1rem;
	}

	.lap-box {
		display: flex;
		flex-direction: column;
		padding: 0.5rem;
		border-radius: 5px;
		background: #f1f2f3;
		color: #333333;
		font-size: 0.875rem;
	}

	.lap-box p {
		margin: 0;
	}
</style>
