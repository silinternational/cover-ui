export const getSeed = () => {
  const seedCookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith('seed='))
    ?.split('=')[1]
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
    document.cookie = `seed=${encodeURIComponent(createSeed())}; path=/`
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
      document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=/`
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
  const accessToken = document.cookie.split('; ').find((row) => row.startsWith('access-token='))
  return accessToken ? accessToken.split('=')[1] : ''
}

function createSeed() {
  return Math.random()
    .toString(36) // Convert to base-36 so we get more letters
    .substring(2) // strip off the leading '0.'
}
