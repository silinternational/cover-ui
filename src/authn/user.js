import { writable } from 'svelte/store'
import { GET } from '../data'

const user = writable(JSON.parse(sessionStorage.getItem('authnUser')) || {})

export default user

export async function loadUser() {
  const userData = await GET('users/me')
  user.set(userData)
  sessionStorage.setItem('authnUser', JSON.stringify(userData))
}

export const clear = () => {
  user.set({})
  sessionStorage.removeItem('authnUser')
}
