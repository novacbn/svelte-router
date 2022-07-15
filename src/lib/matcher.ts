import "urlpattern-polyfill";

import type {Readable} from "svelte/store";
import {derived} from "svelte/store";

import type {IURLStore} from "./url";

export type IMatcherDefinitions<T> = Record<string, T>;

export interface IMatcherResult<T> {
    result: T;

    pattern: URLPatternResult;
}

export type IMatcherStore<T> = Readable<IMatcherResult<T> | null>;

export function matcher<T>(
    store: IURLStore,
    definitions: IMatcherDefinitions<T>
): IMatcherStore<T> {
    const mapped_routes: [URLPattern, T][] = Object.entries(definitions).map((route) => {
        const [pattern, result] = route;

        return [new URLPattern(pattern, location.origin), result];
    });

    return derived(store, ($store) => {
        const {pathname} = new URL($store, location.origin);

        for (const route of mapped_routes) {
            const [pattern, result] = route;

            const pattern_result = pattern.exec(pathname, location.origin);
            if (!pattern_result) continue;

            return {
                result,
                pattern: pattern_result,
            };
        }

        return null;
    });
}
