import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: Record<string, never>;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type IndexedTestingNumProps = typeof __propDef.props;
export type IndexedTestingNumEvents = typeof __propDef.events;
export type IndexedTestingNumSlots = typeof __propDef.slots;
export default class IndexedTestingNum extends SvelteComponentTyped<IndexedTestingNumProps, IndexedTestingNumEvents, IndexedTestingNumSlots> {
}
export {};
