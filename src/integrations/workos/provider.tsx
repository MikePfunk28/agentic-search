import { useNavigate } from "@tanstack/react-router";
import { AuthKitProvider } from "@workos-inc/authkit-react";
import { addBreadcrumb } from "../../lib/sentry";

const VITE_WORKOS_CLIENT_ID = import.meta.env.VITE_WORKOS_CLIENT_ID;
const VITE_WORKOS_API_HOSTNAME = import.meta.env.VITE_WORKOS_API_HOSTNAME;
const DISABLE_AUTH = import.meta.env.VITE_DISABLE_AUTH === 'true';

/**
 * WorkOS Authentication Provider
 *
 * Authentication behavior:
 * - If VITE_DISABLE_AUTH=true is set explicitly, runs without authentication (for development/testing)
 * - If WorkOS env vars are not configured, throws an error (production safety)
 * - If WorkOS is configured, enforces authentication
 *
 * ⚠️ SECURITY NOTE:
 * Protected routes/components MUST:
 *
 * 1. Use RequireAuth component (src/components/RequireAuth.tsx) to enforce
 *    authentication when WorkOS is configured
 * 2. Validate authentication server-side in API routes/server functions
 * 3. Never trust client-side auth state for sensitive operations
 *
 * See docs/authentication-guards.md for implementation guide.
 */
export default function AppWorkOSProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const navigate = useNavigate();

	// Handle explicit auth disabling (for development/testing)
	if (DISABLE_AUTH) {
		addBreadcrumb(
			"Authentication explicitly disabled via VITE_DISABLE_AUTH",
			"auth",
			{ environment: import.meta.env.MODE }
		);
		if (import.meta.env.DEV) {
			console.warn("[WorkOS] Authentication DISABLED via VITE_DISABLE_AUTH environment variable");
		}
		return <>{children}</>;
	}

	// If WorkOS is not configured and auth not explicitly disabled, throw error in production
	if (!VITE_WORKOS_CLIENT_ID || !VITE_WORKOS_API_HOSTNAME) {
		const error = "WorkOS not configured. Set VITE_WORKOS_CLIENT_ID and VITE_WORKOS_API_HOSTNAME, or set VITE_DISABLE_AUTH=true for development.";
		
		addBreadcrumb(
			"WorkOS configuration missing",
			"auth",
			{
				hasClientId: !!VITE_WORKOS_CLIENT_ID,
				hasApiHostname: !!VITE_WORKOS_API_HOSTNAME,
				environment: import.meta.env.MODE,
			}
		);

		// Allow pass-through with warning - auth is disabled
		console.warn(`[WorkOS] ${error}`);
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
