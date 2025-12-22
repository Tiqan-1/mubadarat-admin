import { isEmpty } from "ramda";
import { Suspense, lazy, useMemo } from "react";
import { Navigate, Outlet } from "react-router";

import { useUserPermission } from "@/framework/store/userStore";
import { flattenTrees } from "@/framework/utils/tree";

import type { Permission } from "@/framework/types/entity";
import { BasicStatus, PermissionType } from "@/framework/types/enum";
import type { AppRouteObject } from "@/framework/types/router";
import { CircleLoading } from "@/app/ui/components/loading";

/**
 * Use relative path for glob to avoid issues in production environments
 * where project root resolution might differ.
 */
const PAGES = import.meta.glob("../../../app/ui/pages/**/*.tsx");

/**
 * Normalizes component path and matches it against the PAGES glob keys.
 */
const loadComponentFromPath = (path: string) => {
	// Normalize the incoming path (remove leading slash if present)
	const normalizedPath = path.startsWith("/") ? path.substring(1) : path;

	// Build the target key relative to this file
	// src/framework/router/hooks/use-permission-routes.tsx -> src/app/ui/pages/
	// The target is ../../../app/ui/pages/
	const targetKey = `../../../app/ui/pages/${normalizedPath}`;

	return PAGES[targetKey];
};

import DEFAULT_PERMISSION from "@/app/routes";

export function usePermissionRoutes(): AppRouteObject[] {
	const permissions = useUserPermission() || DEFAULT_PERMISSION;
	return useMemo(() => {
		if (!permissions) return [];

		const flattenedPermissions = flattenTrees(permissions);
		return transformPermissionsToRoutes(permissions, flattenedPermissions);
	}, [permissions]);
}

function transformPermissionsToRoutes(permissions: Permission[], flattenedPermissions: Permission[]): AppRouteObject[] {
	// Filter to only process top-level permissions (no parentId) 
	// or handle specific tree structure if permissions are already nested.
	// In the student app, the permissions from DEFAULT_PERMISSION are flat.
	return permissions.map((permission) => {
		if (permission.type === PermissionType.CATALOGUE) {
			return createCatalogueRoute(permission, flattenedPermissions);
		}
		return createMenuRoute(permission, flattenedPermissions);
	});
}


/**
 * Build complete route path by traversing from current permission to root
 * @param {Permission} permission - current permission
 * @param {Permission[]} flattenedPermissions - flattened permission array
 * @param {string[]} segments - route segments accumulator
 * @returns {string} normalized complete route path
 */
function buildCompleteRoute(
	permission: Permission,
	flattenedPermissions: Permission[],
	segments: string[] = [],
): string {
	// Add current route segment
	segments.unshift(permission.route);

	// Base case: reached root permission
	if (!permission.parentId) {
		return `/${segments.join("/")}`;
	}

	// Find parent and continue recursion
	const parent = flattenedPermissions.find((p) => p.id === permission.parentId);
	if (!parent) {
		console.warn(`Parent permission not found for ID: ${permission.parentId}`);
		return `/${segments.join("/")}`;
	}

	return buildCompleteRoute(parent, flattenedPermissions, segments);
}



// Route Transformers
const createBaseRoute = (permission: Permission, completeRoute: string): AppRouteObject => {
	const { route, label, icon, order, hide, hideTab, status, frameSrc, newFeature } = permission;

	// Ensure the path is relative for child routes to avoid issues with absolute paths in HashRouter
	const normalizedPath = route.startsWith("/") ? route.substring(1) : route;

	const baseRoute: AppRouteObject = {
		path: normalizedPath,
		meta: {
			label,
			key: completeRoute,
			hideMenu: !!hide,
			hideTab,
			disabled: status === BasicStatus.DISABLE,
		},
	};

	if (order) baseRoute.order = order;

	if (baseRoute.meta) {
		baseRoute.meta.newFeature = newFeature;
		if (icon) baseRoute.meta.icon = icon;
		if (frameSrc) baseRoute.meta.frameSrc = frameSrc;
	}

	return baseRoute;
};

const createCatalogueRoute = (permission: Permission, flattenedPermissions: Permission[]): AppRouteObject => {
	const baseRoute = createBaseRoute(permission, buildCompleteRoute(permission, flattenedPermissions));

	if (baseRoute.meta) {
		baseRoute.meta.hideTab = true;
	}

	const { parentId, children = [] } = permission;
	if (!parentId) {
		baseRoute.element = (
			<Suspense fallback={<CircleLoading />}>
				<Outlet />
			</Suspense>
		);
	}

	baseRoute.children = transformPermissionsToRoutes(children, flattenedPermissions);

	if (!isEmpty(children)) {
		baseRoute.children.unshift({
			index: true,
			element: <Navigate to={children[0].route} replace />,
		});
	}

	return baseRoute;
};

const createMenuRoute = (permission: Permission, flattenedPermissions: Permission[]): AppRouteObject => {
	const baseRoute = createBaseRoute(permission, buildCompleteRoute(permission, flattenedPermissions));

	if (permission.component) {
		const loadFn = loadComponentFromPath(permission.component);
		if (loadFn) {
			const Element = lazy(loadFn as any);

			if (permission.frameSrc) {
				baseRoute.element = <Element src={permission.frameSrc} />;
			} else {
				baseRoute.element = (
					<Suspense fallback={<CircleLoading />}>
						<Element />
					</Suspense>
				);
			}
		} else {
			console.error(`Component not found at path: ${permission.component}`);
		}
	}

	// Support children even for MENU types (e.g. sub-menu items)
	if (permission.children && permission.children.length > 0) {
		baseRoute.children = transformPermissionsToRoutes(permission.children, flattenedPermissions);
	}

	return baseRoute;
};
