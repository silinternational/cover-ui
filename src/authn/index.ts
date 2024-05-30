import { CREATE as POST } from 'data'
import { clearApp } from 'data/storage'
import { throwError } from '../error'
import { HOME, ROOT } from 'helpers/routes'
import { writable } from 'svelte/store'

export type AuthLoginResponse = {
  RedirectURL: string
}

export const showApp = writable(false)

export const login = async (inviteCode = ''): Promise<void> => {
  const returnUrl = location.pathname
  let url = 'auth/login'
  if (inviteCode) {
    const inviteParam = new URLSearchParams({ invite: inviteCode }).toString()
    url += `?${inviteParam}`
  }
  if (returnUrl !== ROOT && returnUrl !== HOME && !inviteCode) {
    const returnToParam = new URLSearchParams({ 'return-to': returnUrl }).toString()
    url += returnUrl.includes('?') ? `&${returnToParam}` : `?${returnToParam}`
  }
  const responseData = await POST<AuthLoginResponse>(url)
  if (responseData.RedirectURL) {
    location.replace(responseData.RedirectURL)
  } else {
    throwError('Unexpected response during login: ' + responseData)
  }
}

export const logout = async (): Promise<void> => {
  const logoutUrl = `${process.env.API_HOST}/auth/logout`
  clearApp()
  location.replace(logoutUrl)
}
