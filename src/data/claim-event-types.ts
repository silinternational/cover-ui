import { GET } from '.'
import { start, stop } from '../components/progress'
import { writable } from 'svelte/store'

export type ClaimIncidentType = {
  name: string;
  is_repairable: boolean;
}

export const claimIncidentTypes = writable<ClaimIncidentType[]>([])

export async function loadClaimIncidentTypes() {
  const urlPath = 'config/claim-event-types'
  start(urlPath)

  const results = await GET<ClaimIncidentType[]>(urlPath)

  stop(urlPath)
  
  claimIncidentTypes.set(results)
}
