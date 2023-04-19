import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: Record<string, never>;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type NamedTestingNumProps = typeof __propDef.props;
export type NamedTestingNumEvents = typeof __propDef.events;
export type NamedTestingNumSlots = typeof __propDef.slots;
export default class NamedTestingNum extends SvelteComponentTyped<NamedTestingNumProps, NamedTestingNumEvents, NamedTestingNumSlots> {
}
export {};
