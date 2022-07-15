import type {URLPatternResult} from "urlpattern-polyfill/dist/types";

import type {SvelteComponent} from "svelte";
import type {Readable} from "svelte/store";
import {derived, writable} from "svelte/store";

import type {IHashResult, IHashStore} from "./hash";
import {hash as make_hash_store} from "./hash";

export type IContext = Record<string, any>;

export type IProps = Record<string, any>;

export type INavigatingStore = Readable<boolean>;

export type IRouterStore = Readable<IRouterResult | null>;

interface ILoadContext<Context extends IContext> {
    context: Context;
}

interface ILoadProps<Props extends IProps> {
    props: Props;
}

interface ILoadUntypedInput {
    pattern: URLPatternResult;

    url: URL;
}

interface ILoadUntypedOutput {
    redirect?: string;
}

export type ILoadCallback<Context extends IContext = any, Props extends IProps = any> = (
    input: ILoadInput<Context>
) => ILoadOutput<Context, Props> | void | Promise<ILoadOutput<Context, Props> | void>;

export type ILoadInput<Context extends IContext = any> =
    | ILoadUntypedInput
    | (ILoadUntypedInput & ILoadContext<Context>);

export type ILoadOutput<Context extends IContext = any, Props extends IProps = any> =
    | ILoadUntypedOutput
    | (ILoadUntypedOutput & ILoadContext<Context>)
    | (ILoadUntypedOutput & ILoadProps<Props>)
    | (ILoadUntypedOutput & ILoadContext<Context> & ILoadProps<Props>);

export interface IRouteDefinition {
    default: typeof SvelteComponent;

    load?: ILoadCallback;

    pattern: string | readonly string[];
}

export interface IRouterHandle {
    navigating: INavigatingStore;

    router: IRouterStore;
}
export interface IRouterOptions {
    context?: IContext;

    routes: IRouteDefinition[];
}

export interface IRouterResult {
    Component: typeof SvelteComponent;

    context?: IContext;

    definition: IRouteDefinition;

    props?: IProps;
}

export function router(options: IRouterOptions): IRouterHandle {
    const {context = {}, routes} = options;

    let nonce: any = null;

    const navigating = writable<boolean>(false);
    const hash = make_hash_store<IRouteDefinition>(
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
        $hash: IHashResult<IRouteDefinition>,
        set: (value: IRouterResult) => void
    ): Promise<void> {
        navigating.set(true);

        const {pattern, result} = $hash;
        const current_nonce = nonce;

        const load = result.load as ILoadCallback<IContext, IProps> | undefined;
        let output: ILoadOutput<IContext, IProps> | void;

        if (load) {
            const url = new URL(location.hash.slice(1) || "/", location.origin);
            output = await load({context, pattern, url});

            if (nonce !== current_nonce) return;

            if (output && output.redirect) {
                location.hash = output.redirect;
                return;
            }
        }

        set({
            Component: result.default,

            // @ts-expect-error
            context: output?.context,
            definition: $hash.result,
            // @ts-expect-error
            props: output?.props,
        });

        navigating.set(false);
    }

    const router = derived<IHashStore<IRouteDefinition>, IRouterResult | null>(
        hash,
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
        navigating: {subscribe: navigating.subscribe},
        router,
    };
}
