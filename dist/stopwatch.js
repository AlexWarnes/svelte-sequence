import { get, writable } from 'svelte/store';
function createStopwatch(startAt) {
    let intervalID;
    const clear = () => {
        if (intervalID) {
            clearInterval(intervalID);
            intervalID = null;
        }
    };
    const originalTime = startAt;
    const stopwatchStore = writable(startAt, () => () => {
        if (intervalID)
            clear();
    });
    const { subscribe, set, update } = stopwatchStore;
    const laps = writable([]);
    return {
        subscribe,
        start: () => {
            if (intervalID)
                return;
            intervalID = setInterval(() => {
                update((currentTime) => currentTime + 10);
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
