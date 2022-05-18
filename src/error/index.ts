import { setNotice } from '@silintl/ui-components'
import { writable } from 'svelte/store'

export type CustomError = {
  message?: string
  status?: number
  statusText?: string
  key?: string
}

export const error = writable<CustomError>({})
export const throwError = (message = '', status = 0, statusText = '', key = ''): void => {
  const error = set({ status, statusText, message, key })
  if (error.message) {
    setNotice(error.message)
  }
  throw error
}

export const dismiss = (): CustomError => set({})

// https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror#window.addEventListenererror
window.addEventListener('error', (event) => set(event.error))

// https://developer.mozilla.org/en-US/docs/Web/API/PromiseRejectionEvent
window.onunhandledrejection = (event) => set(event.reason)

function set(someError: CustomError): CustomError {
  const status = someError?.status || 0
  const statusText = someError?.statusText || ''
  const message = someError?.message || ''
  const key = someError?.key || ''

  error.set({ status, statusText, message, key })

  return { status, statusText, message, key }
}
