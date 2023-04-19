import type { TimeUnit } from "./models";
export declare const minMS = 60000;
export declare const hourMS: number;
export declare const dayMS: number;
export declare const weekMS: number;
export declare function getSeconds(ms: number): number;
export declare function getMinutes(ms: number): number;
export declare function getHours(ms: number): number;
export declare function getDays(ms: number): number;
export declare function getWeeks(ms: number): number;
export declare function formatTime(t: number, includeZero?: boolean): {
    time: number;
    unit: string;
    shortUnit: string;
}[];
export declare function convertTimeAndUnitToMS(t: number, u: TimeUnit): number;
