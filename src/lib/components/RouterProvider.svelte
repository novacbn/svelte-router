<script lang="ts">
    import {writable} from "svelte/store";

    import {CONTEXT_PROVIDER} from "../context";
    import type {IServices} from "../load";
    import type {IRouteDefinition, IRouterHandle} from "../router";
    import {router as make_router_handle} from "../router";
    import type {IURLStore} from "../url";
    import {hash} from "../url";

    const definitions = new Set<IRouteDefinition>();
    const handle = writable<IRouterHandle>();

    CONTEXT_PROVIDER.set({
        handle: {subscribe: handle.subscribe},

        register(definition) {
            definitions.add(definition);

            handle.set(
                make_router_handle({
                    routes: Array.from(definitions),
                    services,
                    url,
                })
            );
        },

        unregister(definition) {
            definitions.delete(definition);

            handle.set(
                make_router_handle({
                    routes: Array.from(definitions),
                    services,
                    url,
                })
            );
        },
    });

    export let services: IServices | undefined = undefined;
    export let url: IURLStore = hash();
</script>

<slot />
