import { route } from '@roxi/routify'
import { derived } from 'svelte/store'

export const urlQuery = derived(route, () => {
  const searchParams = new URLSearchParams(window.location.search)
  const results: any = {}
  for (const [key, value] of searchParams) {
    results[key] = value
  }
  return results
})
