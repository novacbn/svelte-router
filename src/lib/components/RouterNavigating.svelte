<script lang="ts">
    import {CONTEXT_PROVIDER} from "../context";

    const {handle} = CONTEXT_PROVIDER.get();

    $: ({navigating} = $handle);
</script>

{#if $navigating}
    <slot />
{/if}
