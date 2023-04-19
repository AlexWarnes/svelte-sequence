import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: Record<string, never>;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type IndexedTestingObjProps = typeof __propDef.props;
export type IndexedTestingObjEvents = typeof __propDef.events;
export type IndexedTestingObjSlots = typeof __propDef.slots;
export default class IndexedTestingObj extends SvelteComponentTyped<IndexedTestingObjProps, IndexedTestingObjEvents, IndexedTestingObjSlots> {
}
export {};
