import { useNavigate } from "@tanstack/react-router";
import { AuthKitProvider } from "@workos-inc/authkit-react";

const VITE_WORKOS_CLIENT_ID = import.meta.env.VITE_WORKOS_CLIENT_ID;
const VITE_WORKOS_API_HOSTNAME = import.meta.env.VITE_WORKOS_API_HOSTNAME;

// WorkOS is OPTIONAL - if not configured, just pass through children
export default function AppWorkOSProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const navigate = useNavigate();

	// If WorkOS is not configured, render children without auth
	if (!VITE_WORKOS_CLIENT_ID || !VITE_WORKOS_API_HOSTNAME) {
		console.info("[WorkOS] Not configured - running without WorkOS auth");
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
