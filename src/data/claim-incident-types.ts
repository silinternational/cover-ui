import { GET } from '.'
import { writable } from 'svelte/store'

export type ClaimIncidentType = {
  name: string
  is_repairable: boolean
}

export const claimIncidentTypes = writable<ClaimIncidentType[]>([])

export async function loadClaimIncidentTypes(): Promise<ClaimIncidentType[]> {
  const urlPath = 'config/claim-incident-types'

  const results = await GET<ClaimIncidentType[]>(urlPath)

  claimIncidentTypes.set(results)

  return results
}
