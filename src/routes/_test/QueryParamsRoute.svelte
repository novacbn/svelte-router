<script context="module" lang="ts">
    import {define_load} from "../../lib";

    export const pattern = "/queryparams";

    interface IProps {
        message: string;
    }

    export const load = define_load<undefined, undefined, IProps>(({url}) => {
        const {message = "N/A"} = Object.fromEntries(url.searchParams.entries());

        return {
            props: {
                message,
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
