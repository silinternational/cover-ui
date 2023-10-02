export const getSeed = () => sessionStorage.getItem('seed')
export const getToken = () => (getAccessToken() ? getSeed() + getAccessToken() : '')
export const clear = () => {
  sessionStorage.removeItem('seed')
  sessionStorage.removeItem('access-token')
  sessionStorage.removeItem('token-type')
}

initialize()
function initialize() {
  sessionStorage.getItem('seed') || sessionStorage.setItem('seed', createSeed())

  initializeToken()
}

function initializeToken() {
  const params = new URLSearchParams(location.search)

  if (init('access-token') || init('token-type')) {
    cleanAddressBar()
  }

  function init(name: string) {
    const value = params.get(name)

    if (value !== null) {
      sessionStorage.setItem(name, value)
      params.delete(name)
    }

    return value
  }

  function cleanAddressBar() {
    const search = [...params].length ? `?${params.toString()}` : ''

    location.replace(location.pathname + search)
  }
}

function getAccessToken() {
  return sessionStorage.getItem('access-token') || ''
}

function createSeed() {
  return Math.random() // doesn't need to be cryptographically strong
    .toString(36) // convert to base-36 so we get more letters
    .substring(2) // strip off the leading '0.'
}
