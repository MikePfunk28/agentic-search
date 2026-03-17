import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { cloudflare } from "@cloudflare/vite-plugin";

const isBuildCommand = process.argv.includes('build')
const sentryPluginFactory = isBuildCommand
  ? (await import('@sentry/vite-plugin')).sentryVitePlugin
  : null

const config = defineConfig(({ command }) => {
  const plugins = [
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ]

  const shouldUseSentryVitePlugin =
    command === 'build' &&
    Boolean(
      process.env.SENTRY_AUTH_TOKEN &&
        process.env.VITE_SENTRY_ORG &&
        process.env.VITE_SENTRY_PROJECT,
    )

  if (shouldUseSentryVitePlugin) {
    plugins.push(
      sentryPluginFactory!({
        org: process.env.VITE_SENTRY_ORG,
        project: process.env.VITE_SENTRY_PROJECT,
        authToken: process.env.SENTRY_AUTH_TOKEN,
        sourcemaps: {
          assets: './.output/**',
        },
        telemetry: false,
      }),
    )
  }

  return {
    plugins,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    ssr: {
      target: 'webworker',
      noExternal: [],
    },
    build: {
      sourcemap: true, // Enable source maps for Sentry
    },
  }
})

export default config
