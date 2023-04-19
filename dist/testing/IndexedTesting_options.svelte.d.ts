import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: Record<string, never>;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type IndexedTestingOptionsProps = typeof __propDef.props;
export type IndexedTestingOptionsEvents = typeof __propDef.events;
export type IndexedTestingOptionsSlots = typeof __propDef.slots;
export default class IndexedTestingOptions extends SvelteComponentTyped<IndexedTestingOptionsProps, IndexedTestingOptionsEvents, IndexedTestingOptionsSlots> {
}
export {};
