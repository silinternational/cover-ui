import { clear as clearToken, getSeed } from './token'
import { clear as clearUser } from './user'
import { CREATE as POST, GET } from '../data'
import { throwError } from '../error'
import { goto } from '@roxi/routify'

export const login = async () => {
  const responseData = await POST(`auth/login/?client-id=${getSeed()}`)
  if (responseData.RedirectURL) {
    location = responseData.RedirectURL
  } else {
    throwError('Unexpected response during login: ' + responseData)
  }
}

export const logout = async () => {
  await GET('auth/logout')
  clearToken()
  clearUser()
  $goto('/logged-out')
}
