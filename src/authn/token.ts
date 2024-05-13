export const getSeed = () => {
  const seedCookie = document.cookie.replace(/(?:(?:^|.*;\s*)seed\s*\=\s*([^;]*).*$)|^.*$/, '$1')
  return seedCookie
}

export const getToken = () => {
  const accessToken = getAccessToken()
  return accessToken ? getSeed() + accessToken : ''
}

export const clear = () => {
  document.cookie = 'seed=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  document.cookie = 'access-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  document.cookie = 'token-type=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
}

initialize()

function initialize() {
  const seed = getSeed()
  if (!seed) {
    document.cookie = `seed=${createSeed()}; path=/`
  }

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
      document.cookie = `${name}=${value}; path=/`
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
  const accessToken = document.cookie.replace(/(?:(?:^|.*;\s*)access-token\s*\=\s*([^;]*).*$)|^.*$/, '$1')
  return accessToken || ''
}

function createSeed() {
  return Math.random().toString(36).substring(2) // Convert to base-36 so we get more letters, strip off the leading '0.'
}
