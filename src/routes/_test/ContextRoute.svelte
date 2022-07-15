<script context="module" lang="ts">
    import {define_load} from "../../lib";

    export const pattern = "/context";

    interface IContext {
        message: string;
    }

    export const load = define_load<undefined, IContext, undefined>(async () => {
        return {
            context: {
                message: "Playwright",
            },
        };
    });
</script>

<script lang="ts">
    import {getContext} from "svelte";

    const message = getContext("message");
</script>

<div id="content">
    Hello, {message}!
</div>
