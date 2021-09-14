import { writable } from 'svelte/store'

export const loading = writable(false)

const pending = []

export const start = id => {
  ! pending.length && loading.set(true)
  
  pending.push(id)
}

export const stop = id => {
  const i = pending.findIndex(anId => anId === id)
  if (i >= 0) {
    pending.splice(i,1)

    !pending.length && loading.set(false)
  }
}

export const isLoadingById = id => pending.includes(anId => anId === id)