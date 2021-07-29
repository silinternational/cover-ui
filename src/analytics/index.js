import { route } from '@roxi/routify'

init()

// https://developers.google.com/analytics/devguides/collection/analyticsjs
function init() {
  window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)}
  ga.l=+new Date

  ga('create', process.env.ANALYTICS_ID, 'auto')

  loadLib()

  route.subscribe(trackPageView)
}

function loadLib() {
  const script = document.createElement('script')

  script.src = 'https://www.google-analytics.com/analytics.js'
  script.async = true
  
  document.head.appendChild(script)
}

function trackPageView(page) {
  if (page) {
    // https://developers.google.com/analytics/devguides/collection/analyticsjs/single-page-applications#tracking_virtual_pageviews
    ga('set', 'page', location.pathname) 
    // https://developers.google.com/analytics/devguides/collection/analyticsjs/pages#pageview_fields
    ga('send', 'pageview')
  }
}

function trackEvent(primary, secondary, tertiary) {
  // https://developers.google.com/analytics/devguides/collection/analyticsjs/events#event_fields
  ga('send', 'event', primary, secondary, tertiary)
}

export const notFound = () => trackEvent('Error', 'Page not found')
