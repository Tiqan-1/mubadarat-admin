import { isEmpty } from "ramda";
import { useEffect, useState } from "react";
import { type Params, useMatches, useOutlet } from "react-router";

import { useFlattenedRoutes } from "./use-flattened-routes";
import { useRouter } from "./use-router";

import type { RouteMeta } from "@/framework/types/router";

const { VITE_APP_HOMEPAGE: HOMEPAGE } = import.meta.env;
/**
 * Returns the Meta information of the current route
 */
export function useCurrentRouteMeta() {
    // const pathname = usePathname();
    const { push } = useRouter();

    // Gets the route component instance
    const children = useOutlet();

    // Gets all matched routes
    const matchs = useMatches();

    // Gets the flattened route menu
    const flattenedRoutes = useFlattenedRoutes();

    const [currentRouteMeta, setCurrentRouteMeta] = useState<RouteMeta>();

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        // Gets the currently matched route
        const lastRoute = matchs[-1];
        if (!lastRoute) return;

        const { pathname, params } = lastRoute;
        const matchedRouteMeta = flattenedRoutes.find((item) => {
            const replacedKey = replaceDynamicParams(item.key, params);
            return replacedKey === pathname || `${replacedKey}/` === pathname;
        });

        if (matchedRouteMeta) {
            matchedRouteMeta.outlet = children;
            if (!isEmpty(params)) {
                matchedRouteMeta.params = params;
            }
            setCurrentRouteMeta({ ...matchedRouteMeta });
        } else {
            push(HOMEPAGE);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [matchs]);

    return currentRouteMeta;
}

/**
 * replace `user/:id`  to `/user/1234512345`
 */
export const replaceDynamicParams = (menuKey: string, params: Params<string>) => {
    let replacedPathName = menuKey;

    // Parses the parameter names in the route path
    const paramNames = menuKey.match(/:\w+/g);

    if (paramNames) {
        for (const paramName of paramNames) {
            // Removes the colon to get the parameter name
            const paramKey = paramName.slice(1);
            if (!params[paramKey]) continue;

            replacedPathName = replacedPathName.replace(paramName, params[paramKey]);
        }
    }

    return replacedPathName;
};