import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: Record<string, never>;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type IndexedTestingUpdaterProps = typeof __propDef.props;
export type IndexedTestingUpdaterEvents = typeof __propDef.events;
export type IndexedTestingUpdaterSlots = typeof __propDef.slots;
export default class IndexedTestingUpdater extends SvelteComponentTyped<IndexedTestingUpdaterProps, IndexedTestingUpdaterEvents, IndexedTestingUpdaterSlots> {
}
export {};
