import { writable } from 'svelte/store'

export const loading = writable<boolean>(false)

const pending: string[] = []

export const start = (id: string): void => {
  !pending.length && loading.set(true)

  pending.push(id)
}

export const stop = (id: string): void => {
  const i = pending.findIndex((anId) => anId === id)
  if (i >= 0) {
    pending.splice(i, 1)

    !pending.length && loading.set(false)
  }
}

export const isLoadingById = (id: string): boolean => pending.includes(id)
