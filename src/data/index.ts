import { getToken } from '../authn/token'
import { start, stop } from '../components/progress'
import { throwError } from '../error'
import t from '../i18n'

type FetchMethod = 'post' | 'get' | 'put' | 'delete';

export async function CREATE(uri: string, body: any = undefined) { return await customFetch('post'  , uri, body) }
export async function GET   (uri: string      ) { return await customFetch('get'   , uri      ) }
export async function UPDATE(uri: string, body) { return await customFetch('put'   , uri, body) }
export async function DELETE(uri: string      ) { return await customFetch('delete', uri      ) }

// https://developer.mozilla.org/en-US/docs/Web/API/FormData/FormData
export const upload = async formData => await CREATE('upload', formData)

// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#Supplying_request_options
async function customFetch(method: FetchMethod, uri: string, body: any = undefined) {
  const headers = {
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
  let response: Response = {} as Response
  try {
    start(url)

    response = await fetch(url, {
      method,
      credentials: 'include', // ensures the response back from the api will be allowed to "set-cookie"
      headers,
      body,
    })
  } catch (e) {
    // these only occur for network errors, like these:
    //     request made with a bad host, e.g., //httpbin
    //     the host is refusing connections
    //     client is offline, i.e., airplane mode or something
    //     CORS preflight failures
    throwError(e)
  } finally {
    stop(url)
  }
  
  const results = await response.json()

  // reminder: fetch does not throw exceptions for non-200 responses (https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch)
  if (! response.ok) {
    const code = response.status
    const message = code === 401 ? t(response.statusText) : response.statusText

    throwError(message, code)
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
const includesHost = uri => uri.match(/^(?:https?:)?\/\//)