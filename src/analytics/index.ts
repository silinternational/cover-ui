import { route } from '@roxi/routify'

const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID

init()

// https://developers.google.com/analytics/devguides/collection/gtagjs
// https://developers.google.com/analytics/devguides/collection/upgrade/analyticsjs
function init() {
  loadLib()

  // TODO: get the dataLayer references to play nicer with ts
  ;(window as any).dataLayer = (window as any).dataLayer || []
  window.gtag = () => (window as any).dataLayer.push(arguments)

  gtag('js', new Date())

  //since we are sending manually we need to disable the default of sending each pageview
  gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false,
  })

  route.subscribe(trackPageView)
}

function loadLib() {
  const script = document.createElement('script')

  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  script.async = true

  document.head.appendChild(script)
}

function trackPageView(page) {
  if (page) {
    // https://developers.google.com/analytics/devguides/collection/gtagjs/pages#default_behavior
    gtag('event', 'page_view', {
      page_path: location.pathname, //page.path or page.shortPath are also available
    })
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
function trackEvent(eventName, eventParameters) {
  gtag('event', eventName, eventParameters)
}

export const notFound = () => trackEvent('Error', 'Page not found')
