import { GET, UPDATE } from '.'
import { writable } from 'svelte/store'

export type EntityCode = {
  code: string
  id: string
  name: string
}

export type Entity = {
  id: string
  name: string
  code: string
  active: boolean
  income_account: string
  parent_entity: string
}

export const entityCodes = writable<EntityCode[]>([])

//deprecated endpoint
export async function loadEntityCodes(): Promise<void> {
  const urlPath = 'config/entity-codes'

  const results = await GET<EntityCode[]>(urlPath)

  entityCodes.set(results)
}

export const getEntities = async (): Promise<Entity[]> => {
  const results = await GET<Entity[]>('entity-codes')

  return results
}

export const getEntity = async (id: string): Promise<Entity> => {
  const results = await GET<Entity>(`entity-codes/${id}`)
  return results
}

export const updateEntity = async (entity: Entity): Promise<Entity> => {
  const urlPath = `entity-codes/${entity.id}`

  const body = {
    active: entity.active,
    income_account: entity.income_account,
    name: entity.name,
    parent_entity: entity.parent_entity,
  }

  const results = await UPDATE<Entity>(urlPath, body)

  return results
}
