export const getSeed = () => localStorage.getItem('seed')
export const getToken = () => (getAccessToken() ? getSeed() + getAccessToken() : '')
export const clear = () => {
  localStorage.removeItem('seed')
  localStorage.removeItem('access-token')
  localStorage.removeItem('token-type')
}

initialize()
function initialize() {
  localStorage.getItem('seed') || localStorage.setItem('seed', createSeed())

  initializeToken()
}

function initializeToken() {
  const params = new URLSearchParams(location.search)

  if (init('access-token') || init('token-type')) {
    cleanAddressBar()
  }

  function init(name) {
    const value = params.get(name)

    if (value !== null) {
      localStorage.setItem(name, value)
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
  return localStorage.getItem('access-token') || ''
}

function createSeed() {
  return Math.random() // doesn't need to be cryptographically strong
    .toString(36) // convert to base-36 so we get more letters
    .substring(2) // strip off the leading '0.'
}
