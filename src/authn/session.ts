import * as routes from 'helpers/routes'
import { writable } from 'svelte/store'

export const initialized = writable<boolean>(false)

export const getLastPath = (): { path: string; lastSet: number } => {
  return {
    path: localStorage.getItem('last-path') || '',
    lastSet: Number(localStorage.getItem('last-path-set')),
  }
}

const lastPathBlacklist = [routes.ROOT, routes.HOME, routes.LOGOUT, routes.LOGGEDOUT]
export const setLastPath = (path: string): void => {
  if (!lastPathBlacklist.includes(path)) {
    initialized.set(true)
    localStorage.setItem('last-path', path)
    localStorage.setItem('last-path-set', String(Date.now()))
  }
}
