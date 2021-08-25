import { writable } from 'svelte/store'
import { GET } from '../data'

const user = writable({})

export default user

export async function loadUser() {
  const userData = await GET('users/me')
  user.set(userData)
}

export const clear = () => {
  user.set({})
}
