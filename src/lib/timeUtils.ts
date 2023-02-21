import type { TimeUnit } from "./models";

export const minMS = 60_000;
export const hourMS = minMS * 60;
export const dayMS = hourMS * 24;
export const weekMS = dayMS * 7;
export function getSeconds(ms: number) {
	return Math.floor(ms / 1000);
}
export function getMinutes(ms: number) {
	return Math.floor(ms / minMS);
}
export function getHours(ms: number) {
	return Math.floor(ms / hourMS);
}
export function getDays(ms: number) {
	return Math.floor(ms / dayMS);
}
export function getWeeks(ms: number) {
	return Math.floor(ms / weekMS);
}

function extractUnits(t: number) {
	const wk = Math.floor(t / weekMS);
	const wkms = wk * weekMS;
  const d = Math.floor((t - wkms) / dayMS);
  const dms = d * dayMS;
	const h = Math.floor((t - (wkms + dms)) / hourMS);
	const hms = h * hourMS;
	const m = Math.floor((t - (wkms + dms + hms)) / minMS);
	const mms = m * minMS;
	const s = (t - (wkms + dms + hms + mms)) % minMS;
	return {
		wk,
    d,
		h,
		m,
		s
	};
}

export function formatTime(t: number, includeZero: boolean = false) {
	const { wk, d, h, m, s } = extractUnits(t);
	const timeList = [
		{ time: wk, unit: wk === 1 ? 'week' : 'weeks', shortUnit: 'wk' },
		{ time: d, unit: d === 1 ? 'day' : 'days', shortUnit: 'd' },
		{ time: h, unit: h === 1 ? 'hour' : 'hours', shortUnit: 'hr' },
		{ time: m, unit: m === 1 ? 'minute' : 'minutes', shortUnit: 'min' },
		{ time: s / 1000, unit: s === 1 ? 'second' : 'seconds', shortUnit: 's' }
	];
	if (includeZero) {
		return timeList;
	} else {
		return timeList.filter((tData) => tData.time > 0);
	}
}

export function convertTimeAndUnitToMS(t: number, u: TimeUnit){
  switch(u){
    case "ms":
      return t;
    case 's':
      return t * 1000;
    case 'm':
      return t * minMS;
    case 'h':
      return t * hourMS;
    case 'd':
      return t * dayMS;
    case 'w':
      return t * weekMS;
    default:
      console.warn("Unrecognized unit in timer:", u);
      return t;
  }
}