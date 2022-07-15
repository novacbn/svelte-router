<script context="module" lang="ts">
    import {define_load} from "../../lib";

    export const pattern = "/fetch";

    interface IData {
        message: string;
    }

    interface IProps {
        message: string;
    }

    export const load = define_load<undefined, undefined, IProps>(async () => {
        const response = await fetch("/data.json");
        const data = (await response.json()) as IData;

        return {
            props: {
                message: data.message,
            },
        };
    });
</script>

<script lang="ts">
    export let message: string;
</script>

<div id="content">
    Hello, {message}!
</div>
