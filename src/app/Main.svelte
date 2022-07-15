<script context="module" lang="ts">
    export interface IServices {
        random(): number;
    }
</script>

<script lang="ts">
    import {Router} from "../lib";

    import * as BasicRoute from "./routes/BasicRoute.svelte";
    import * as ContextRoute from "./routes/ContextRoute.svelte";
    import * as FetchRoute from "./routes/FetchRoute.svelte";
    import * as NavigatingRoute from "./routes/NavigatingRoute.svelte";
    import * as QueryParamsRoute from "./routes/QueryParamsRoute.svelte";
    import * as RouteParamsRoute from "./routes/RouteParamsRoute.svelte";
    import * as ServicesRoute from "./routes/ServicesRoute.svelte";

    const SERVICES: IServices = {
        random: () => Math.random(),
    };
</script>

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
