import type {Readable} from "svelte/store";
import {readable} from "svelte/store";

export interface IURLStore extends Readable<string> {
    navigate<T = any>(href: string, state?: T): void;

    state<T = any>(): T | undefined;

    update<T = any>(state?: T): void;
}

function get_hash_href(): string {
    const {hash, pathname, search} = new URL(
        window.location.hash.slice(1) || "/",
        window.location.origin
    );

    return `${pathname}${search}${hash}`;
}

function get_location_href(): string {
    const {hash, pathname, search} = new URL(window.location.href);

    return `${pathname}${search}${hash}`;
}

export function hash(): IURLStore {
    const {subscribe} = readable(get_hash_href(), (set) => {
        function on_pop_state(): void {
            const url = get_hash_href();

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

        state() {
            return history.state;
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
    const {subscribe} = readable(get_location_href(), (set) => {
        function on_popstate(): void {
            const href = get_location_href();

            set(href);
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

        state() {
            return history.state;
        },

        subscribe,

        update(state = undefined) {
            const {hash, pathname, search, origin} = window.location;

            history.replaceState(state, "", `${origin}/${pathname.slice(1)}${search}${hash}`);
        },
    };
}
