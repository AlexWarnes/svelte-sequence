import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: Record<string, never>;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type NamedTestingOptionsProps = typeof __propDef.props;
export type NamedTestingOptionsEvents = typeof __propDef.events;
export type NamedTestingOptionsSlots = typeof __propDef.slots;
export default class NamedTestingOptions extends SvelteComponentTyped<NamedTestingOptionsProps, NamedTestingOptionsEvents, NamedTestingOptionsSlots> {
}
export {};
