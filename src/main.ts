import './analytics'
import App from 'components/App.svelte'
import './components/global.css'
import * as Sentry from '@sentry/svelte'

const dsn = import.meta.env.VITE_SENTRY_DSN
const environment = __EVIRONMENT__
const release = __APP_VERSION__

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

const app = new App({
  target: document.getElementById('app')!,
})

export default app
