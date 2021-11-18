import { GET } from '.'
import { writable } from 'svelte/store'

export type ClaimIncidentType = {
  name: string
  is_repairable: boolean
  description: string
}

export const claimIncidentTypes = writable<ClaimIncidentType[]>([])

export async function loadClaimIncidentTypes(): Promise<void> {
  const urlPath = 'config/claim-incident-types'

  const results = await GET<ClaimIncidentType[]>(urlPath)

  claimIncidentTypes.set(results)
}
