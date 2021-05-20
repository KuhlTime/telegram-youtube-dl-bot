const Sentry = require('@sentry/node')
const env = require('./env.js')

// sentryDsn might not be set
if (env.sentryDsn) {
  Sentry.init({
    dsn: 'https://0d8a20d31d124b81bfbea7a5e7b9d349@o459771.ingest.sentry.io/5738691',

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0
  })
}
