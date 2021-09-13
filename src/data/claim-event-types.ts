import { GET } from '.'
import { start, stop } from '../components/progress'
import { writable } from 'svelte/store'

export const claimEventTypes = writable([])

export async function loadClaimEventTypes() {
  const urlPath = 'config/claim-event-types'
  start(urlPath)

  const results = await GET(urlPath)

  stop(urlPath)
  
  claimEventTypes.set(results)
}
