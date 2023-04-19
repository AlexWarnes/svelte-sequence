import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: Record<string, never>;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type NamedTestingObjProps = typeof __propDef.props;
export type NamedTestingObjEvents = typeof __propDef.events;
export type NamedTestingObjSlots = typeof __propDef.slots;
export default class NamedTestingObj extends SvelteComponentTyped<NamedTestingObjProps, NamedTestingObjEvents, NamedTestingObjSlots> {
}
export {};
