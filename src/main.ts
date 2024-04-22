import './analytics'
import App from 'components/App.svelte'
import './components/global.css'
import * as Sentry from '@sentry/svelte'

const environment = process.env.CF_PAGES_BRANCH
const dsn = process.env.SENTRY_DSN
const release = process.env.npm_package_version

console.debug(`Sentry.init ${dsn} ${environment} ${release}`)
Sentry.init({
  dsn,
  integrations: [Sentry.browserTracingIntegration()],
  environment,
  release,

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
})

new App({
  target: document.body,
})
