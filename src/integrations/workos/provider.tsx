import { useNavigate } from "@tanstack/react-router";
import { AuthKitProvider } from "@workos-inc/authkit-react";
import { addBreadcrumb } from "../../lib/sentry";

const VITE_WORKOS_CLIENT_ID = import.meta.env.VITE_WORKOS_CLIENT_ID;
const VITE_WORKOS_API_HOSTNAME = import.meta.env.VITE_WORKOS_API_HOSTNAME;

/**
 * Provides WorkOS authentication to its descendant components when WorkOS is configured.
 *
 * When the WorkOS environment variables are missing, this component renders `children` directly
 * and records a breadcrumb so the app continues to run without client-side WorkOS authentication.
 *
 * Security: client-side pass-through does not protect resources. Server-side validation and
 * explicit authentication guards (e.g., RequireAuth) are required for any protected routes or
 * sensitive operations.
 *
 * @returns The children wrapped with `AuthKitProvider` when WorkOS is configured; otherwise the children as rendered.
 */
export default function AppWorkOSProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const navigate = useNavigate();

	// If WorkOS is not configured, render children without auth
	if (!VITE_WORKOS_CLIENT_ID || !VITE_WORKOS_API_HOSTNAME) {
		// Use structured logging via Sentry breadcrumbs in production
		addBreadcrumb(
			"WorkOS not configured - running without authentication",
			"auth",
			{
				hasClientId: !!VITE_WORKOS_CLIENT_ID,
				hasApiHostname: !!VITE_WORKOS_API_HOSTNAME,
				environment: import.meta.env.MODE,
			}
		);

		// Keep console.info for development visibility
		if (import.meta.env.DEV) {
			console.info("[WorkOS] Not configured - running without WorkOS auth");
		}

		return <>{children}</>;
	}

	// If WorkOS is configured, wrap with AuthKitProvider
	return (
		<AuthKitProvider
			clientId={VITE_WORKOS_CLIENT_ID}
			apiHostname={VITE_WORKOS_API_HOSTNAME}
			onRedirectCallback={({ state }) => {
				if (state?.returnTo) {
					navigate(state.returnTo);
				}
			}}
		>
			{children}
		</AuthKitProvider>
	);
}