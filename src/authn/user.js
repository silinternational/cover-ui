import { writable } from 'svelte/store'

const user = writable(JSON.parse(sessionStorage.getItem('authnUser')) || {})

export default user

export const load = anAuthnUser => {
  // normally this might be a call to the backend.
  user.set(anAuthnUser)
  sessionStorage.setItem('authnUser', JSON.stringify(anAuthnUser))
}

export const clear = () => {
  user.set({})
  sessionStorage.removeItem('authnUser')
}
