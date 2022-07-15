<script context="module" lang="ts">
    export interface IServices {
        random(): number;
    }
</script>

<script lang="ts">
    import {browser} from "$app/env";

    import {Router} from "../lib";

    import * as BasicRoute from "./_test/BasicRoute.svelte";
    import * as ContextRoute from "./_test/ContextRoute.svelte";
    import * as FetchRoute from "./_test/FetchRoute.svelte";
    import * as NavigatingRoute from "./_test/NavigatingRoute.svelte";
    import * as QueryParamsRoute from "./_test/QueryParamsRoute.svelte";
    import * as RouteParamsRoute from "./_test/RouteParamsRoute.svelte";
    import * as ServicesRoute from "./_test/ServicesRoute.svelte";

    const SERVICES: IServices = {
        random: () => Math.random(),
    };
</script>

{#if browser}
    <a href="#">home</a>
    <a href="#/fallback">fallback</a>
    <a href="#/context">context</a>
    <a href="#/fetch">fetch</a>
    <a href="#/navigating">navigating</a>
    <a href="#/queryparams?message=World">queryparams</a>
    <a href="#/routeparams/Svelte">routeparams</a>
    <a href="#/services">services</a>

    <br />

    <Router.Provider services={SERVICES}>
        <Router.Route definition={BasicRoute} />
        <Router.Route definition={ContextRoute} />
        <Router.Route definition={FetchRoute} />
        <Router.Route definition={NavigatingRoute} />
        <Router.Route definition={QueryParamsRoute} />
        <Router.Route definition={RouteParamsRoute} />
        <Router.Route definition={ServicesRoute} />

        <Router.Navigating>navigating</Router.Navigating>
        <Router.Fallback>no route found</Router.Fallback>
    </Router.Provider>
{/if}
