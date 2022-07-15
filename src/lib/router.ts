import type {SvelteComponent} from "svelte";
import type {Readable} from "svelte/store";
import {derived, get, writable} from "svelte/store";

import type {IMatcherResult, IMatcherStore} from "./matcher";
import {matcher as make_matcher_store} from "./matcher";
import type {IContext, ILoadCallback, ILoadOutput, IProps, IServices} from "./load";
import type {IURLStore} from "./url";
import {hash as make_hash_store} from "./url";

export type INavigatingStore = Readable<boolean>;

export type IRouterStore = Readable<IRouterResult | null>;

export interface IRouteDefinition<
    Services extends IServices | undefined = undefined,
    Context extends IContext | undefined = undefined,
    Props extends IContext | undefined = undefined
> {
    default: typeof SvelteComponent;

    load?: ILoadCallback<Services, Context, Props>;

    pattern: string | readonly string[];
}

export interface IRouterHandle {
    navigate(href: string): void;

    navigating: INavigatingStore;

    router: IRouterStore;
}
export interface IRouterOptions {
    routes: IRouteDefinition[];

    services?: IServices;

    url?: IURLStore;
}

export interface IRouterResult {
    Component: typeof SvelteComponent;

    context?: IContext;

    definition: IRouteDefinition;

    props?: IProps;
}

export function router(options: IRouterOptions): IRouterHandle {
    const {routes, services, url: option_url} = options;

    let nonce: any = null;

    const navigating = writable<boolean>(false);
    const url = option_url ?? make_hash_store();

    const matcher = make_matcher_store<IRouteDefinition>(
        url,
        Object.fromEntries(
            routes
                .map((route) => {
                    const patterns =
                        typeof route.pattern === "string" ? [route.pattern] : route.pattern;

                    return patterns.map((pattern) => [pattern, route]);
                })
                .flat()
        )
    );

    async function get_route(
        $hash: IMatcherResult<IRouteDefinition>,
        set: (value: IRouterResult) => void
    ): Promise<void> {
        navigating.set(true);

        const {pattern, result} = $hash;
        const current_nonce = nonce;

        const load = result.load as ILoadCallback<IServices, IContext, IProps> | undefined;
        let output: ILoadOutput<IContext, IProps> | void;

        if (load) {
            const $url = get(url);

            output = await load({
                pattern,
                // @ts-expect-error: HACK: if they're not provided, the route `load` functions should /not/ be consuming /anyway/
                services,
                url: $url,
            });

            if (nonce !== current_nonce) return;

            if (output && output.redirect) {
                location.hash = output.redirect;
                return;
            }
        }

        set({
            Component: result.default,

            context: output?.context,
            definition: $hash.result,
            props: output?.props,
        });

        navigating.set(false);
    }

    const router = derived<IMatcherStore<IRouteDefinition>, IRouterResult | null>(
        matcher,
        ($hash, set) => {
            nonce = {};

            if ($hash) get_route($hash, set);
            else {
                navigating.set(false);
                set(null);
            }
        }
    );

    return {
        navigate(href) {
            url.navigate(href);
        },

        navigating: {subscribe: navigating.subscribe},
        router,
    };
}
