import ProtectedRoute from "@/framework/router/components/protected-route";
import { ERROR_ROUTE } from "@/framework/router/error-routes";
import { AUTH_ROUTE, NO_MATCHED_ROUTE } from "@/framework/router/general-routes";
import { usePermissionRoutes } from "@/framework/router/hooks";
import type { AppRouteObject } from "@/framework/types/router";
import DashboardLayout from "@/app/ui/layouts/dashboard";
import { Navigate, type RouteObject, createHashRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import AssignmentBuilder from "@/app/ui/pages/content/assignments/builder";

const { VITE_APP_HOMEPAGE: HOMEPAGE } = import.meta.env;

export const  FORM_BUILDER_ROUTE: AppRouteObject = {
	path: "builder",
	element: <AssignmentBuilder />,
};
 
export default function Router() {
	const permissionRoutes = usePermissionRoutes();

	const PROTECTED_ROUTE: AppRouteObject = {
		path: "/",
		element: (
			<ProtectedRoute>
				<DashboardLayout />
			</ProtectedRoute>
		),
		children: [{ index: true, element: <Navigate to={HOMEPAGE} replace /> }, ...permissionRoutes],
	};

	const routes = [AUTH_ROUTE, PROTECTED_ROUTE, ERROR_ROUTE, FORM_BUILDER_ROUTE, NO_MATCHED_ROUTE] as RouteObject[];

	const router = createHashRouter(routes);

	return <RouterProvider router={router} />;
}
