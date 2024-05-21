import { CREATE as POST } from 'data'
import { clearApp } from 'data/storage'
import { throwError } from '../error'
import { clearSeed, getSeed } from './seed'
import { writable } from 'svelte/store'

export type AuthLoginResponse = {
  RedirectURL: string
}

export const showApp = writable(false)

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
  const logoutUrl = `${process.env.API_HOST}/auth/logout}`
  clearApp()
  clearSeed()
  location.replace(logoutUrl)
}
