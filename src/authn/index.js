
import { clear as clearToken, getSeed, getToken } from './token'
import { clear as clearUser } from './user'
import { CREATE as POST } from '../data'
import { throwError } from '../error'

export const login = async () => {
  const responseData = await POST(`auth/login/?client-id=${getSeed()}`)
  if (responseData.RedirectURL) {
    location.replace(responseData.RedirectURL)
  } else {
    throwError('Unexpected response during login: ' + responseData)
  }
}

export const logout = async () => {
  const logoutUrl = `${process.env.API_HOST}/auth/logout?token=${encodeURIComponent(getToken())}`
  clearToken()
  clearUser()
  location.replace(logoutUrl)
}
