import Cookies from 'js-cookie'

const secure = process.env.CF_PAGES_BRANCH === 'main' || process.env.CF_PAGES_BRANCH === 'develop'

export const getSeed = () => {
  const seedCookie = Cookies.get('seed')
  return seedCookie
}

export const clearSeed = () => {
  Cookies.remove('seed', { sameSite: 'strict', secure })
}

initialize()

function initialize() {
  const seed = getSeed()
  if (!seed) {
    Cookies.set('seed', createSeed(), { expires: 7, sameSite: 'strict', secure })
  }
}

function createSeed() {
  return Math.random()
    .toString(36) // Convert to base-36 so we get more letters
    .substring(2) // strip off the leading '0.'
}
