import { params } from '@roxi/routify'
import { derived } from 'svelte/store'

export const query = derived(params, () => {
  const searchParams = new URLSearchParams(window.location.search)
  const results: any = {}
  for (const [key, value] of searchParams) {
    results[key] = value
  }
  return results
})
