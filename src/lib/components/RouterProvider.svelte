<script lang="ts">
    import {writable} from "svelte/store";

    import {CONTEXT_PROVIDER} from "../context";
    import type {IContext, IRouteDefinition, IRouterHandle} from "../router";
    import {router as make_router_handle} from "../router";

    const definitions = new Set<IRouteDefinition>();
    const handle = writable<IRouterHandle>();

    CONTEXT_PROVIDER.set({
        handle: {subscribe: handle.subscribe},

        register(definition) {
            definitions.add(definition);

            handle.set(
                make_router_handle({
                    context,
                    routes: Array.from(definitions),
                })
            );
        },

        unregister(definition) {
            definitions.delete(definition);

            handle.set(
                make_router_handle({
                    context,
                    routes: Array.from(definitions),
                })
            );
        },
    });

    export let context: IContext | undefined = undefined;
</script>

<slot />
