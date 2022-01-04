import { getToken } from '../authn/token'
import { start, stop } from 'components/progress'
import { throwError } from '../error'
import { HOME } from 'helpers/routes'
import { clearApp } from './storage'

type FetchMethod = 'post' | 'get' | 'put' | 'delete'
type UploadResponseBody = {
  content_type: string
  filename: string
  id: string
  size: number
  url: string
}

export async function CREATE<T>(uri: string, body: any = undefined): Promise<T> {
  return await customFetch<T>('post', uri, body)
}
export async function GET<T>(uri: string): Promise<T> {
  return await customFetch<T>('get', uri)
}
export async function UPDATE<T>(uri: string, body: unknown): Promise<T> {
  return await customFetch<T>('put', uri, body)
}
export async function DELETE<T>(uri: string): Promise<T> {
  return await customFetch<T>('delete', uri)
}

// https://developer.mozilla.org/en-US/docs/Web/API/FormData/FormData
export const upload = async (formData: FormData): Promise<any> => await CREATE<UploadResponseBody>('upload', formData)

// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#Supplying_request_options
async function customFetch<T>(method: FetchMethod, uri: string, body: any = undefined): Promise<T> {
  const headers: HeadersInit = {
    Authorization: `Bearer ${getToken()}`,
    'Content-Type': 'application/json',
  }

  // when dealing with FormData, i.e., when uploading files, allow the browser to set the request up
  // so boundary information is built properly.
  if (body instanceof FormData) {
    delete headers['Content-Type']
  } else {
    body = JSON.stringify(body)
  }

  const url = includesHost(uri) ? uri : `${process.env.API_HOST}/${uri}`
  let response = {} as Response
  try {
    start(uri)

    response = await fetch(url, {
      method,
      credentials: 'include', // ensures the response back from the api will be allowed to "set-cookie"
      headers,
      body,
    })
  } catch (e: any) {
    // these only occur for network errors, like these:
    //     request made with a bad host, e.g., //httpbin
    //     the host is refusing connections
    //     client is offline, i.e., airplane mode or something
    //     CORS preflight failures
    throwError(e)
  } finally {
    stop(uri)
  }
  const results = response.status === 204 /* No Content */ ? {} : await response.json()

  // reminder: fetch does not throw exceptions for non-200 responses (https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch)
  if (!response.ok) {
    if (response.status === 401) {
      clearApp()

      if (location.pathname !== HOME) {
        location.replace(`${location.origin}${HOME}`)
      }
    }
    throwError(results?.message, response.status, response.statusText)
  }

  return results
}

// matches:
//    http://example.com
//    https://example.com
//    //example.com
// not these:
//    redirect-to?url=//example.org/home?abc=123
//    redirect-to?url=https://example.org/home?abc=123
const includesHost = (uri: string) => uri.match(/^(?:https?:)?\/\//)
