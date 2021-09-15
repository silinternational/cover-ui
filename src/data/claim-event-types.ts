import { GET } from '.'
import { start, stop } from '../components/progress'
import { writable } from 'svelte/store'

export type ClaimEventType = {
  name: string;
  is_repairable: boolean;
}

export const claimEventTypes = writable<ClaimEventType[]>([])

export async function loadClaimEventTypes() {
  const urlPath = 'config/claim-event-types'
  start(urlPath)

  const results = await GET<ClaimEventType[]>(urlPath)

  stop(urlPath)
  
  claimEventTypes.set(results)
}
