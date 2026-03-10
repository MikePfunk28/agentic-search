/**
 * Convex HTTP Routes
 *
 * Registers auth routes for OAuth callbacks (GitHub, etc.)
 */

import { httpRouter } from "convex/server";
import { auth } from "./auth";

const http = httpRouter();

// Register auth HTTP routes (OAuth callbacks, etc.)
auth.addHttpRoutes(http);

export default http;
