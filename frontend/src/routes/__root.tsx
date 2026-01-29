import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet, Link } from "@tanstack/react-router";

interface RouterContext {
    queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
    component: () => (
        <>
            {/* Layout */}
            <Outlet />
        </>
    ),
    notFoundComponent: () => (
        <div>
            <p>Oups! Page not found</p>
            <Link to="/">Return to homepage</Link>
        </div>
    )
});
