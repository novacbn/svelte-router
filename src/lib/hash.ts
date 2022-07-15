import "urlpattern-polyfill";

import type {Readable} from "svelte/store";
import {readable} from "svelte/store";

export type IHashDefinitions<T> = Record<string, T>;

export interface IHashResult<T> {
    result: T;

    pattern: URLPatternResult;
}

export type IHashStore<T> = Readable<IHashResult<T> | null>;

export function hash<T>(definitions: IHashDefinitions<T>): IHashStore<T> {
    const mapped_routes: [URLPattern, T][] = Object.entries(definitions).map((route) => {
        const [pattern, result] = route;

        return [new URLPattern(pattern, location.origin), result];
    });

    return readable<IHashResult<T> | null>(null, (set) => {
        function on_popstate(): void {
            const url = new URL(location.hash.slice(1) || "/", location.origin);
            const hash = url.pathname;

            for (const route of mapped_routes) {
                const [pattern, result] = route;
                const pattern_result = pattern.exec(hash, location.origin);

                if (!pattern_result) continue;

                set({
                    result,
                    pattern: pattern_result,
                });

                return;
            }

            set(null);
        }

        on_popstate();

        window.addEventListener("popstate", on_popstate);
        return () => window.removeEventListener("popstate", on_popstate);
    });
}
