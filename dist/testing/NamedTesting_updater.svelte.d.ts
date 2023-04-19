import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: Record<string, never>;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type NamedTestingUpdaterProps = typeof __propDef.props;
export type NamedTestingUpdaterEvents = typeof __propDef.events;
export type NamedTestingUpdaterSlots = typeof __propDef.slots;
export default class NamedTestingUpdater extends SvelteComponentTyped<NamedTestingUpdaterProps, NamedTestingUpdaterEvents, NamedTestingUpdaterSlots> {
}
export {};
