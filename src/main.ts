import './analytics'
import App from 'components/App.svelte'
import './components/global.css'
import * as Sentry from '@sentry/svelte'

const environment = process.env.CF_PAGES_BRANCH
const dsn = process.env.SENTRY_DSN

console.debug(`Sentry.init ${dsn} ${environment}`)
Sentry.init({
  dsn,
  integrations: [new Sentry.BrowserTracing()],
  environment,

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
})

new App({
  target: document.body,
})
