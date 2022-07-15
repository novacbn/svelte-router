<script lang="ts">
    import {CONTEXT_PROVIDER} from "../context";

    const {handle} = CONTEXT_PROVIDER.get();

    $: ({router, navigating} = $handle);
</script>

{#if !$router && !$navigating}
    <slot />
{/if}
