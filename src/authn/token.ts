import Cookies from 'js-cookie'

export const getSeed = () => {
  const seedCookie = Cookies.get('seed')
  return seedCookie
}

export const getToken = () => {
  const accessToken = getAccessToken()
  return accessToken ? getSeed() + accessToken : ''
}

export const clear = () => {
  Cookies.remove('seed', { sameSite: 'strict' })
  Cookies.remove('access-token', { sameSite: 'strict' })
  Cookies.remove('token-type', { sameSite: 'strict' })
}

initialize()

function initialize() {
  const seed = getSeed()
  if (!seed) {
    Cookies.set('seed', createSeed(), { expires: 7, sameSite: 'strict' })
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
      Cookies.set(name, value, { expires: 7, sameSite: 'strict' })
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
  const accessToken = Cookies.get('access-token')
  return accessToken || ''
}

function createSeed() {
  return Math.random()
    .toString(36) // Convert to base-36 so we get more letters
    .substring(2) // strip off the leading '0.'
}
