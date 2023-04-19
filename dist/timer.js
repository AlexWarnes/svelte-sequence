import { writable } from 'svelte/store';
import { convertTimeAndUnitToMS } from './timeUtils';
function createTimer(t, u) {
    let intervalID;
    const clear = () => {
        if (intervalID) {
            clearInterval(intervalID);
            intervalID = null;
        }
    };
    const originalTime = convertTimeAndUnitToMS(t, u);
    const { subscribe, set, update } = writable(originalTime, () => () => {
        if (intervalID)
            clear();
    });
    return {
        subscribe,
        start: () => {
            if (intervalID)
                return;
            intervalID = setInterval(() => {
                update((currentTime) => currentTime - 10);
            }, 10);
        },
        pause: () => {
            if (intervalID)
                clear();
        },
        reset: () => {
            if (intervalID)
                clear();
            set(originalTime);
        },
        add: (time, unit = 'ms') => {
            const duration = convertTimeAndUnitToMS(time, unit);
            update((currentTime) => currentTime + duration);
        }
    };
}
export const timer = (time, unit = 'ms') => createTimer(time, unit);
