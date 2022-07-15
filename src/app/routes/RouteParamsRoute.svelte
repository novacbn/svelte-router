<script context="module" lang="ts">
    import {define_load} from "../../lib";

    export const pattern = "/routeparams/:message";

    interface IProps {
        message: string;
    }

    export const load = define_load<undefined, undefined, IProps>(({pattern}) => {
        const {message = "N/A"} = pattern.pathname.groups;

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
