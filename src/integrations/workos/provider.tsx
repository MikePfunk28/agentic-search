import { useNavigate } from "@tanstack/react-router";
import { AuthKitProvider } from "@workos-inc/authkit-react";
import { addBreadcrumb } from "../../lib/sentry";

const VITE_WORKOS_CLIENT_ID = import.meta.env.VITE_WORKOS_CLIENT_ID;
const VITE_WORKOS_API_HOSTNAME = import.meta.env.VITE_WORKOS_API_HOSTNAME;

/**
 * WorkOS Authentication Provider
 *
 * This provider is OPTIONAL - when WorkOS env vars are not configured,
 * the app runs without authentication (children are rendered directly).
 *
 * ⚠️ SECURITY NOTE:
 * This intentional pass-through behavior means client-side auth guards alone
 * are insufficient for protecting resources. Protected routes/components MUST:
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

	// If WorkOS is not configured, render children without auth
	if (!VITE_WORKOS_CLIENT_ID || !VITE_VITE_WORKOS_API_HOSTNAME) {
		// Use structured logging via Sentry breadcrumbs in production
		addBreadcrumb(
			"WorkOS not configured - running without authentication",
			"auth",
			{
				hasClientId: !!VITE_WORKOS_CLIENT_ID,
				hasApiHostname: !!VITE_VITE_WORKOS_API_HOSTNAME,
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
			apiHostname={VITE_VITE_WORKOS_API_HOSTNAME}
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
