<script lang="ts">
    import {browser} from "$app/env";

    import {Router} from "../lib";

    import * as BasicRoute from "./_test/BasicRoute.svelte";
    import * as FetchRoute from "./_test/FetchRoute.svelte";
    import * as NavigatingRoute from "./_test/NavigatingRoute.svelte";
    import * as QueryParamsRoute from "./_test/QueryParamsRoute.svelte";
    import * as RouteParamsRoute from "./_test/RouteParamsRoute.svelte";
</script>

{#if browser}
    <a href="#">home</a>
    <a href="#/navigating">navigating</a>
    <a href="#/queryparams?message=World">queryparams</a>
    <a href="#/routeparams/Svelte">routeparams</a>
    <a href="#/fetch">fetch</a>
    <a href="#/fallback">fallback</a>

    <br />

    <Router.Provider>
        <Router.Route definition={BasicRoute} />
        <Router.Route definition={NavigatingRoute} />
        <Router.Route definition={QueryParamsRoute} />
        <Router.Route definition={RouteParamsRoute} />
        <Router.Route definition={FetchRoute} />

        <Router.Navigating>navigating</Router.Navigating>
        <Router.Fallback>no route found</Router.Fallback>
    </Router.Provider>
{/if}
