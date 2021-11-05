import { GET } from '.'
import { writable } from 'svelte/store'

export type EntityCode = {
  code: 'string'
  id: 'string'
  name: 'string'
}

export const entityCodes = writable<EntityCode[]>([])

export async function loadEntityCodes(): Promise<void> {
  const urlPath = 'config/entity-codes'

  const results = await GET<EntityCode[]>(urlPath)

  entityCodes.set(results)
}
