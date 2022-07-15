import type {Readable} from "svelte/store";
import {readable} from "svelte/store";

export interface IURLStore extends Readable<URL> {
    navigate<T = any>(href: string, state?: T): void;

    update<T = any>(state?: T): void;
}

function get_hash_url(): URL {
    return new URL(window.location.hash.slice(1) || "/", window.location.origin);
}

function get_location_url(): URL {
    return new URL(window.location.href);
}

export function hash(): IURLStore {
    const {subscribe} = readable<URL>(get_hash_url(), (set) => {
        function on_pop_state(): void {
            const url = get_hash_url();

            set(url);
        }

        on_pop_state();

        window.addEventListener("popstate", on_pop_state);
        return () => window.removeEventListener("popstate", on_pop_state);
    });

    return {
        navigate(href, state = undefined) {
            const {pathname, origin} = window.location;
            const {hash, pathname: href_pathname, search} = new URL(href, origin);

            history.pushState(
                state,
                "",
                `${origin}/${pathname.slice(1)}#${href_pathname}${search}${hash}`
            );

            window.dispatchEvent(new PopStateEvent("popstate"));
        },

        subscribe,

        update(state = undefined) {
            const {hash, pathname, origin} = window.location;

            history.replaceState(
                state,
                "",
                `${origin}/${pathname.slice(1)}#${hash.slice(1) || "/"}`
            );

            window.dispatchEvent(new PopStateEvent("popstate"));
        },
    };
}

export function location(): IURLStore {
    const {subscribe} = readable<URL>(get_location_url(), (set) => {
        function on_popstate(): void {
            const url = get_location_url();

            set(url);
        }

        on_popstate();

        window.addEventListener("popstate", on_popstate);
        return () => window.removeEventListener("popstate", on_popstate);
    });

    return {
        navigate(href, state = undefined) {
            const {origin} = window.location;
            const {hash, pathname, search} = new URL(href, origin);

            history.pushState(state, "", `${origin}/${pathname.slice(1)}${search}${hash}`);
        },

        subscribe,

        update(state = undefined) {
            const {hash, pathname, search, origin} = window.location;

            history.replaceState(state, "", `${origin}/${pathname.slice(1)}${search}${hash}`);
        },
    };
}
