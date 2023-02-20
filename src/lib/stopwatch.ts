import { derived, get, writable } from 'svelte/store';
import type { Lap } from './models';

function createStopwatch(startAt: number) {
	const stopwatchStore = writable(startAt);
	const { subscribe, set, update } = stopwatchStore;
	const originalTime = startAt;
	let intervalID: ReturnType<typeof setInterval>;
	const laps = writable<Lap[]>([]);
	return {
		subscribe,
		start: () => {
			if (intervalID) clearInterval(intervalID);

			intervalID = setInterval(() => {
				update((currentTime) => currentTime + 10);
			}, 10);
		},
		pause: () => {
			if (intervalID) clearInterval(intervalID);
		},
		reset: () => {
			if (intervalID) clearInterval(intervalID);
			set(originalTime);
			laps.set([]);
		},
		laps,
		addLap: () => {
			laps.update((currentLaps) => {
				const prevLap = currentLaps[0];
				const totalTime = get(stopwatchStore);
				const prevTotalTime = prevLap?.totalTime ?? 0;
				const lapTime = totalTime - prevTotalTime;
				const lapDelta = prevLap ? lapTime - (prevLap.lapTime) : 0;
				const lapNumber = currentLaps.length + 1;
				return [
					{
						lapNumber,
            lapTime,
						totalTime,
						delta: lapDelta
					},
					...currentLaps
				];
			});
		}
	};
}

export const stopwatch = (startTime = 0) => createStopwatch(startTime);
