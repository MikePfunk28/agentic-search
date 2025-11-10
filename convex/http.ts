/**
 * Convex HTTP Routes
 *
 * Exposes OAuth callback routes for Convex Auth.
 * WorkOS redirects here after authentication.
 */

import { httpRouter } from "convex/server";
import { auth } from "./auth.config";

const http = httpRouter();

// Mount authentication routes (handles /api/auth/*)
auth.addHttpRoutes(http);

export default http;
