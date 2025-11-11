Welcome to your new TanStack app!

# Getting Started

To run this application:

```bash
pnpm install
pnpm start
```

# Building For Production

To build this application for production:

```bash
pnpm build
```

## Testing

This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:

```bash
pnpm test
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.


## Linting & Formatting

This project uses [Biome](https://biomejs.dev/) for linting and formatting. The following scripts are available:


```bash
pnpm lint
pnpm format
pnpm check
```


## Setting up WorkOS

- Set the `VITE_WORKOS_CLIENT_ID` in your `.env.local`.


## Setting up Convex

- Set the `VITE_CONVEX_URL` and `CONVEX_DEPLOYMENT` environment variables in your `.env.local`. (Or run `npx convex init` to set them automatically.)
- Run `npx convex dev` to start the Convex server.


## Shadcn

Add components using the latest version of [Shadcn](https://ui.shadcn.com/).

```bash
pnpx shadcn@latest add button
```


## T3Env

- You can use T3Env to add type safety to your environment variables.
- Add Environment variables to the `src/env.mjs` file.
- Use the environment variables in your code.

### Usage

```ts
import { env } from "@/env";

console.log(env.VITE_APP_TITLE);
```





# Agentic Search Platform

Production-ready intelligent search platform with **human-in-the-loop learning**, multi-model support (local + cloud), encrypted API storage, and automated training data collection.

## Status: Production Ready

✅ **All Critical Bugs Fixed**:
- TanStack devtools menu removed
- CSRF 403 errors resolved with token endpoint
- Infinite Ollama detection loop fixed with useRef guard
- Hydration warnings suppression turned off.

## .env Setup

```env
# Required for Convex backend
VITE_CONVEX_URL=your_convex_deployment_url
CONVEX_DEPLOYMENT=your_convex_deployment

# Required for WorkOS authentication
VITE_WORKOS_CLIENT_ID=your_workos_client_id

# Optional: AI providers (or use UI to configure encrypted keys)
ANTHROPIC_API_KEY=your_anthropic_api_key
OPENAI_API_KEY=your_openai_api_key

# Optional: Error tracking
VITE_SENTRY_DSN=your_sentry_dsn
```

## Features

### Human-in-the-Loop Learning
- 🧠 **Interactive Segmentation**: AI proposes query segments, user approves/modifies before execution
- 📊 **Search History Browsing**: View past searches, results, quality scores, re-run queries
- 🎯 **Reasoning Step Control**: Validate AI reasoning at each step, provide corrections
- 📈 **Training Data Collection**: All interactions stored for model fine-tuning
- 🔄 **Comparison Dashboard**: Side-by-side results from different segment approaches

### AI Model Support
- 🤖 **6 Providers**: OpenAI, Anthropic, Google, Ollama, LM Studio, Azure
- 🔍 **Auto-Detection**: Finds local Ollama models at localhost:11434
- 🔐 **Encrypted Keys**: Web Crypto API + Convex encrypted storage (AES-256-GCM)
- ⚡ **Smart Switching**: Auto-selects best model based on cost/quality/speed
- 📝 **Rich Formatting**: Markdown with syntax highlighting, streaming responses

### Security & Quality
- 🔒 **CSRF Protection**: HttpOnly cookies with X-CSRF-Token headers
- 🔑 **Key Encryption**: Client-side Web Crypto API + server-side Convex backup
- 📊 **Quality Metrics**: ADD discriminator scores, user approval rates
- 🎭 **PII Detection**: Automatic anonymization of sensitive data
- 🚨 **Sentry Monitoring**: Error tracking and performance monitoring

### User Experience
- 🎨 **Modern UI**: Tailwind CSS, Lucide icons, responsive design
- 🔍 **Segment Approval**: Edit/approve/reject AI-proposed search segments
- 📚 **History Browser**: Filter by model, date, quality; export as JSON/CSV
- 🔄 **Re-run Searches**: One-click to retry with same query
- 📋 **Export Training Data**: S3 + JSONL format for OpenAI fine-tuning

## Architecture

### Tech Stack
- **Frontend**: TanStack Start, TanStack Router, TanStack Store
- **Backend**: Convex (real-time database + functions)
- **Auth**: WorkOS (enterprise SSO)
- **Styling**: Tailwind CSS + Shadcn/ui
- **AI**: Anthropic, OpenAI, Google, Ollama, LM Studio, Azure
- **Monitoring**: Sentry (errors + performance)
- **Deployment**: Cloudflare Pages at mikepfunk.com

### Key Components
- **EnhancedModelSelector**: Multi-provider model selection with auto-detection
- **AgenticChat**: Chat interface with CSRF protection and streaming
- **SegmentApprovalModal**: Interactive UI for approving AI query segments (pending)
- **SearchHistoryPage**: Browse past searches with results (pending)
- **ComparisonDashboard**: Side-by-side segment results (pending)


## Documentation

For complete system architecture, see [SYSTEM_ARCHITECTURE.md](./docs/SYSTEM_ARCHITECTURE.md)

**Key Docs**:
- [CHANGELOG](./CHANGELOG.md) - Recent bug fixes and system updates
- [Project Plan](./docs/plan.md) - Full roadmap and current status
- [System Architecture](./docs/SYSTEM_ARCHITECTURE.md) - Complete technical design
- [Convex Schema](./convex/schema.ts) - Database tables for human-in-the-loop learning

## Routing
This project uses [TanStack Router](https://tanstack.com/router). The initial setup is a file based router. Which means that the routes are managed as files in `src/routes`.

### Adding A Route

To add a new route to your application just add another a new file in the `./src/routes` directory.

TanStack will automatically generate the content of the route file for you.

Now that you have two routes you can use a `Link` component to navigate between them.

### Adding Links

To use SPA (Single Page Application) navigation you will need to import the `Link` component from `@tanstack/react-router`.

```tsx
import { Link } from "@tanstack/react-router";
```

Then anywhere in your JSX you can use it like so:

```tsx
<Link to="/about">About</Link>
```

This will create a link that will navigate to the `/about` route.

More information on the `Link` component can be found in the [Link documentation](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent).

### Using A Layout

In the File Based Routing setup the layout is located in `src/routes/__root.tsx`. Anything you add to the root route will appear in all the routes. The route content will appear in the JSX where you use the `<Outlet />` component.

Here is an example layout that includes a header:

```tsx
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { Link } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>
      </header>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
```

The `<TanStackRouterDevtools />` component is not required so you can remove it if you don't want it in your layout.

More information on layouts can be found in the [Layouts documentation](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts#layouts).


## Data Fetching

There are multiple ways to fetch data in your application. You can use TanStack Query to fetch data from a server. But you can also use the `loader` functionality built into TanStack Router to load the data for a route before it's rendered.

For example:

```tsx
const peopleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/people",
  loader: async () => {
    const response = await fetch("https://swapi.dev/api/people");
    return response.json() as Promise<{
      results: {
        name: string;
      }[];
    }>;
  },
  component: () => {
    const data = peopleRoute.useLoaderData();
    return (
      <ul>
        {data.results.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    );
  },
});
```

Loaders simplify your data fetching logic dramatically. Check out more information in the [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#loader-parameters).

### React-Query

React-Query is an excellent addition or alternative to route loading and integrating it into you application is a breeze.

First add your dependencies:

```bash
pnpm add @tanstack/react-query @tanstack/react-query-devtools
```

Next we'll need to create a query client and provider. We recommend putting those in `main.tsx`.

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ...

const queryClient = new QueryClient();

// ...

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
```

You can also add TanStack Query Devtools to the root route (optional).

```tsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <ReactQueryDevtools buttonPosition="top-right" />
      <TanStackRouterDevtools />
    </>
  ),
});
```

Now you can use `useQuery` to fetch your data.

```tsx
import { useQuery } from "@tanstack/react-query";

import "./App.css";

function App() {
  const { data } = useQuery({
    queryKey: ["people"],
    queryFn: () =>
      fetch("https://swapi.dev/api/people")
        .then((res) => res.json())
        .then((data) => data.results as { name: string }[]),
    initialData: [],
  });

  return (
    <div>
      <ul>
        {data.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

You can find out everything you need to know on how to use React-Query in the [React-Query documentation](https://tanstack.com/query/latest/docs/framework/react/overview).

## State Management

Another common requirement for React applications is state management. There are many options for state management in React. TanStack Store provides a great starting point for your project.

First you need to add TanStack Store as a dependency:

```bash
pnpm add @tanstack/store
```

Now let's create a simple counter in the `src/App.tsx` file as a demonstration.

```tsx
import { useStore } from "@tanstack/react-store";
import { Store } from "@tanstack/store";
import "./App.css";

const countStore = new Store(0);

function App() {
  const count = useStore(countStore);
  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
    </div>
  );
}

export default App;
```

One of the many nice features of TanStack Store is the ability to derive state from other state. That derived state will update when the base state updates.

Let's check this out by doubling the count using derived state.

```tsx
import { useStore } from "@tanstack/react-store";
import { Store, Derived } from "@tanstack/store";
import "./App.css";

const countStore = new Store(0);

const doubledStore = new Derived({
  fn: () => countStore.state * 2,
  deps: [countStore],
});
doubledStore.mount();

function App() {
  const count = useStore(countStore);
  const doubledCount = useStore(doubledStore);

  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
      <div>Doubled - {doubledCount}</div>
    </div>
  );
}

export default App;
```

We use the `Derived` class to create a new store that is derived from another store. The `Derived` class has a `mount` method that will start the derived store updating.

Once we've created the derived store we can use it in the `App` component just like we would any other store using the `useStore` hook.

You can find out everything you need to know on how to use TanStack Store in the [TanStack Store documentation](https://tanstack.com/store/latest).

## Recent Bug Fixes

### Fixed: TanStack Devtools Menu (2024-01-XX)
**Issue**: Unwanted settings panel appearing on page
**Solution**: Removed TanStackDevtools component from `__root.tsx`, added `suppressHydrationWarning`

### Fixed: CSRF 403 Forbidden (2024-01-XX)
**Issue**: POST `/api/chat` failing with 403 due to missing CSRF token
**Solution**:
- Created `/api/csrf-token` GET endpoint to set HttpOnly cookie
- Modified `useCsrfToken` hook to fetch token on mount
- Added `isReady` state to `AgenticChat` to disable chat until token ready

### Fixed: Infinite Ollama Detection Loop (2024-01-XX)
**Issue**: `http://localhost:11434/api/tags` fetching repeatedly in infinite loop
**Solution**:
- Wrapped `modelOptions` in `useMemo` to prevent recreation
- Added `useRef` guard (`hasDetected`) to ensure detection runs once
- Updated `useEffect` dependency array correctly

## Demo Files

Files prefixed with `demo` can be safely deleted. They are there to provide a starting point for you to play around with the features you've installed.

## Learn More

- [TanStack Documentation](https://tanstack.com)
- [Convex TanStack Start Guide](https://docs.convex.dev/quickstart/tanstack-start)
- [System Architecture](./docs/SYSTEM_ARCHITECTURE.md)
- [Project Plan](./docs/plan.md)
