import {getContext, setContext} from "svelte";
import type {Readable} from "svelte/store";

import type {IRouteDefinition, IRouterHandle} from "./router";

export interface IProviderContext {
    handle: Readable<IRouterHandle>;

    register: (definition: IRouteDefinition) => void;

    unregister: (definition: IRouteDefinition) => void;
}

const SYMBOL_ROUTER_PROVIDER = Symbol.for("nbn-svelte-router-provider");

export const CONTEXT_PROVIDER = {
    get() {
        return getContext<IProviderContext>(SYMBOL_ROUTER_PROVIDER);
    },

    set(value: IProviderContext) {
        setContext(SYMBOL_ROUTER_PROVIDER, value);
    },
};
