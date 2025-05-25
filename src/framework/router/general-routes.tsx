import type { AppRouteObject } from "@/framework/types/router";
import Login from "@/app/ui/pages/sys/auth";
import PageError from "@/app/ui/pages/sys/error/PageError";
import { ErrorBoundary } from "react-error-boundary";
import { Navigate } from "react-router";

export const  AUTH_ROUTE: AppRouteObject = {
	path: "/login",
	element: (
		<ErrorBoundary FallbackComponent={PageError}>
			<Login />
		</ErrorBoundary>
	),
};

export const  NO_MATCHED_ROUTE: AppRouteObject = {
	path: "*",
	element: <Navigate to="/404" replace />,
};
 