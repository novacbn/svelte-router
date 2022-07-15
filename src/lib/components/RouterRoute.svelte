<script lang="ts">
    import {onDestroy, setContext} from "svelte";

    import {CONTEXT_PROVIDER} from "../context";
    import type {IRouteDefinition} from "../router";

    const {handle, register, unregister} = CONTEXT_PROVIDER.get();

    export let definition: IRouteDefinition<any, any, any>;

    register(definition);

    onDestroy(() => {
        unregister(definition);
    });

    $: ({router} = $handle);

    $: {
        if ($router && $router.context) {
            for (const key in $router.context) setContext(key, $router.context[key]);
        }
    }
</script>

{#if $router && $router.definition === definition}
    <svelte:component this={$router.Component} {...$router.props ?? {}} />
{/if}
