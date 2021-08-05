import { GET } from './index'
import { writable } from 'svelte/store'

export const currentUser = writable({})

export async function loadUser() {
  const user = await GET('users/me')
  currentUser.set(user)
}
