<script context="module" lang="ts">
    import {define_load} from "../../lib";

    import type {IServices} from "../index.svelte";

    export const pattern = "/services";

    interface IProps {
        value: number;
    }

    export const load = define_load<IServices, undefined, IProps>(async ({services}) => {
        const value = services.random();

        return {
            props: {
                value,
            },
        };
    });
</script>

<script lang="ts">
    export let value: number;
</script>

<div id="content">
    the random value was: {value}!
</div>
