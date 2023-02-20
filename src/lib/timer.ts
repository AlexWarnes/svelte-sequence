import { writable } from 'svelte/store';
import type { TimeUnit } from './models';
import { convertTimeAndUnitToMS } from './timeUtils';


function createTimer(t: number, u: TimeUnit){
	const originalTime = convertTimeAndUnitToMS(t, u);
	const { subscribe, set, update } = writable(originalTime);
	const snoozeDuration = 60_000
	let intervalID: ReturnType<typeof setInterval>;
	
	return {
		subscribe,
		start: () => {
			if (intervalID) clearInterval(intervalID);
			
			intervalID = setInterval(() => {
				update(currentTime => currentTime - 10)
			}, 10)
		},
		pause: () => {
			if (intervalID) clearInterval(intervalID);
		},
		reset: () => {
			if (intervalID) clearInterval(intervalID);
			set(originalTime);
		},
		add: (time: number, unit: TimeUnit = 'ms') => {
      const duration = convertTimeAndUnitToMS(time, unit);
			update(currentTime => currentTime + duration)
		}
		
	}
}

export const timer = (time: number, unit: TimeUnit = 'ms') => createTimer(time, unit)