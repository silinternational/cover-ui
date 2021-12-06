import { clear as clearToken, getSeed, getToken } from './token'
import { clear as clearUser } from './user'
import { CREATE as POST } from 'data'
import { throwError } from '../error'

export type AuthLoginResponse = {
  RedirectURL: string
}

export const login = async (inviteCode = ''): Promise<void> => {
  let url = `auth/login/?client-id=${getSeed()}`
  if (inviteCode) {
    url += `&invite=${inviteCode}`
  }
  const responseData = await POST<AuthLoginResponse>(url)
  if (responseData.RedirectURL) {
    location.replace(responseData.RedirectURL)
  } else {
    throwError('Unexpected response during login: ' + responseData)
  }
}

export const logout = async (): Promise<void> => {
  const logoutUrl = `${process.env.API_HOST}/auth/logout?token=${encodeURIComponent(getToken())}`
  clearToken()
  clearUser()
  location.replace(logoutUrl)
}
