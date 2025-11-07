import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://702af28ad38faebd2a7784669ec466af@o4510314186014720.ingest.us.sentry.io/4510314188636160",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true
});

const container = document.getElementById(“app”);
const root = createRoot(container);
root.render(<App />)