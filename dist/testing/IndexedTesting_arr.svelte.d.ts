import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: Record<string, never>;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type IndexedTestingArrProps = typeof __propDef.props;
export type IndexedTestingArrEvents = typeof __propDef.events;
export type IndexedTestingArrSlots = typeof __propDef.slots;
export default class IndexedTestingArr extends SvelteComponentTyped<IndexedTestingArrProps, IndexedTestingArrEvents, IndexedTestingArrSlots> {
}
export {};
