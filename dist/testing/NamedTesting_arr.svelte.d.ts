import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: Record<string, never>;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type NamedTestingArrProps = typeof __propDef.props;
export type NamedTestingArrEvents = typeof __propDef.events;
export type NamedTestingArrSlots = typeof __propDef.slots;
export default class NamedTestingArr extends SvelteComponentTyped<NamedTestingArrProps, NamedTestingArrEvents, NamedTestingArrSlots> {
}
export {};
