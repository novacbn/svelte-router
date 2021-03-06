# svelte-router

> Simple declarative clientside Svelte Router modeled on Web APIs and SvelteKit.

`svelte-router` is a simple router that uses declarative XML markup to build clientside routing using the Browser's hash fragment as the source path name. With the URL matching powered by the standard [`URLPattern`](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern) Web API and asynchronous load functions modeled on SvelteKit's pages.

## Getting Started

1. Install the package via NPM:

```sh
npm install @novacbn/svelte-router
```

2. Import the `Router` namespace of Components and your route into your main Svelte file and declare them:

**Main.svelte**

<!-- prettier-ignore -->
```html
<script>
    import {Router} from "@novacbn/svelte-router";

    // NOTE: You need to import your routes as a module rather than by their default exports
    import * as MyRoute from "./MyRoute.svelte";
</script>

<Router.Provider>
    <Router.Route definition={MyRoute} />
</Router.Provider>
```

3. Define your route's `load` functionality and URL `pattern`:

**MyRoute.svelte**

<!-- prettier-ignore -->
```html
<script context="module">
    import {define_load} from "@novacbn/svelte-router";

    // NOTE: Check out the link below for pattern syntax
    // https://developer.mozilla.org/en-US/docs/Web/API/URL_Pattern_API
    export const pattern = "/:file";

    // NOTE: Usage of `define_load` is /not required/, but helps provide typing awareness to your IDE
    export const load = define_load(async ({pattern}) => {
        const {file} = pattern.pathname.groups;

        const response = await fetch(`${file}.json`);
        const data = await response.json();

        // NOTE: Any members you add to the `props` object gets passed to the Component's exports
        return {
            props: {
                data,
            },
        };
    });
</script>

<script>
    export let data;
</script>

Hello, {data.message}!
```

4. Enjoy!

## API

### `Router.Fallback`

Whenever a hash fragment URL is navigated to and there's no available registered routes, the `default` slot content will be rendered.

<!-- prettier-ignore -->
```html
<script>
    import {Router} from "@novacbn/svelte-router";

    import * as MyRoute from "./MyRoute.svelte";
</script>

<Router.Provider>
    <Router.Route definition={MyRoute} />

    <Router.Fallback>
        404: not found
    </Router.Fallback>
</Router.Provider>
```

### `Router.Navigating`

Whenever a `load` function is being await'd on, the `default` slot content will be rendered.

<!-- prettier-ignore -->
```html
<script>
    import {Router} from "@novacbn/svelte-router";

    import * as MyRoute from "./MyRoute.svelte";
</script>

<Router.Provider>
    <Router.Route definition={MyRoute} />

    <Router.Navigating>
        <div class="overlay-spinner" />
    </Router.Navigating>
</Router.Provider>
```

### `Router.Provider`

```typescript
interface $$Props {
    /**
     * Represents an optional cache of values that can be utilized by a `load` function
     */
    services?: Record<string, any>;

    /**
     * Represents an optional custom Svelte Store which spits out `URL` objects to source location data from
     */
    url?: IURLStore;
}
```

Configures the required Svelte Contexts for all other children `<Router.*>` Components can function. Along with holding a services cache for passing into child `load` functions.

**Main.svelte**

<!-- prettier-ignore -->
```html
<script>
    import {Router} from "@novacbn/svelte-router";

    import * as MyRoute from "./MyRoute.svelte";

    const my_services = {
        my_value: true
    }
</script>

<Router.Provider services={my_services}>
    ...
</Router.Provider>
```

**MyRoute.svelte**

<!-- prettier-ignore -->
```html
<script context="module">
    import {define_load} from "@novacbn/svelte-router";

    export const load = define_load(({services}) => {
        const value = services.my_value;
    });
</script>
```

### `Router.Route`

Renders the provided route definition whenever it's active.

```typescript
export interface IRouteDefinition {
    /**
     * Represents the Svelte Component that renders whenever the route is active
     */
    default: typeof SvelteComponent;

    /**
     * Represents an optional callback used to fetch prerequisite data before rendering the route.
     */
    load?: ILoadCallback;

    /**
     * Represents pathname URL patterns to match against the hash fragment.
     *
     * See: https://developer.mozilla.org/en-US/docs/Web/API/URL_Pattern_API
     */
    pattern: string | string[];
}

export interface $$Props {
    /**
     * Represents the definition of the route being added.
     */
    definition: IRouteDefinition;
}
```

**Main.svelte**

<!-- prettier-ignore -->
```html
<script>
    import {Router} from "@novacbn/svelte-router";

    import * as MyRoute from "./MyRoute.svelte";
</script>

<Router.Provider>
    <Router.Route definition={MyRoute} />
</Router.Provider>
```

### `ILoadCallback`

```typescript
export interface ILoadInput {
    /**
     * Represents the matched route parameters defined in the exported `pattern`.
     *
     * See: https://developer.mozilla.org/en-US/docs/Web/API/URLPattern/exec
     */
    pattern: URLPatternResult;

    /**
     * Represents the values supplied in `<Route.Provider services={...}>`, only available if supplied.
     */
    services?: Record<string, any>;

    /**
     * Represents the matched URL components.
     *
     * See: https://developer.mozilla.org/en-US/docs/Web/API/URL
     */
    url: URL;
}

export interface ILoadOutput {
    /**
     * Represents key values that will be set as Svelte Contexts whenever the route is mounted.
     */
    context?: Record<string, any>;

    /**
     * Represents key values that will be passed into the mounted route as properties.
     */
    props?: Record<string, any>;

    /**
     * Represents a hash fragment that will be redirected to, instead of normal navigation if supplied.
     */
    redirect?: string;
}

export type ILoadCallback = (input: ILoadInput) => ILoadOutput | void | Promise<ILoadOutput | void>;
```

Represents a `load` function with its inputs and outputs.

**MyRoute.svelte**

<!-- prettier-ignore -->
```html
<script context="module">
    import {define_load} from "@novacbn/svelte-router";

    export const load = define_load((input) => {
        const {pattern, services, url} = input;

        return {
            context: {
                ...
            },

            props: {
                ...
            },

            redirect: "...",
        };
    });
</script>
```

### `hash`

Represents a Svelte Store that bases its `URL` object output on the Browser's current hash fragment.

<!-- prettier-ignore -->
```html
<script>
    import {Router, hash} from "@novacbn/router";

    const store = hash();
</script>

<Router.Provider url={store}>
    ...
</Router.Provider>
```

### `location`

Represents a Svelte Store that bases its `URL` object output on the Browser's current URL bar.

<!-- prettier-ignore -->
```html
<script>
    import {Router, location} from "@novacbn/router";

    const store = location();
</script>

<Router.Provider url={store}>
    ...
</Router.Provider>
```
