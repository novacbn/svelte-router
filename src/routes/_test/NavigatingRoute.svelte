<script context="module">
    import {define_load} from "../../lib";

    export const pattern = "/navigating";

    export const load = define_load(() => {
        return new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });
    });
</script>

<div id="content">this the navigating route</div>
