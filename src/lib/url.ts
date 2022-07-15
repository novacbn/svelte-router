import type {Readable} from "svelte/store";
import {readable} from "svelte/store";

export type IURLStore = Readable<URL>;

function get_hash_url(): URL {
    return new URL(window.location.hash.slice(1) || "/", window.location.origin);
}

function get_location_url(): URL {
    return new URL(window.location.href);
}

export function hash(): IURLStore {
    return readable(get_hash_url(), (set) => {
        function on_popstate(): void {
            const url = get_hash_url();

            set(url);
        }

        on_popstate();

        window.addEventListener("popstate", on_popstate);
        return () => window.removeEventListener("popstate", on_popstate);
    });
}

export function location(): IURLStore {
    return readable(get_location_url(), (set) => {
        function on_popstate(): void {
            const url = get_location_url();

            set(url);
        }

        on_popstate();

        window.addEventListener("popstate", on_popstate);
        return () => window.removeEventListener("popstate", on_popstate);
    });
}
