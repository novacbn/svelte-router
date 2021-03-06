import RouterFallback from "./components/RouterFallback.svelte";
import RouterNavigating from "./components/RouterNavigating.svelte";
import RouterProvider from "./components/RouterProvider.svelte";
import RouterRoute from "./components/RouterRoute.svelte";

export * from "./load";
export * from "./url";

export const Router = {
    Fallback: RouterFallback,
    Navigating: RouterNavigating,
    Provider: RouterProvider,
    Route: RouterRoute,
};
