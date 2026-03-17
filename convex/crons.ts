/**
 * Convex Cron Jobs
 *
 * Scheduled tasks that run automatically.
 */

import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Clean up anonymous user data every hour
crons.hourly(
  "cleanup anonymous user data",
  { minuteUTC: 0 },
  internal.sessionCleanup.cleanupAnonymousData,
);

export default crons;
