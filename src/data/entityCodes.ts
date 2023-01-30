import { CREATE, GET, UPDATE } from '.'
import { writable } from 'svelte/store'

export type EntityCode = {
  id: string
  name: string
  code: string
  active: boolean
  income_account: string
  parent_entity: string
}

export const entityCodes = writable<EntityCode[]>([])

export const loadEntityCodes = async (): Promise<void> => {
  const results = await GET<EntityCode[]>('entity-codes')

  entityCodes.set(results)
}

export const getEntity = async (id: string): Promise<EntityCode> => {
  const results = await GET<EntityCode>(`entity-codes/${id}`)
  return results
}

export const updateEntity = async (entity: EntityCode): Promise<EntityCode> => {
  const urlPath = `entity-codes/${entity.id}`

  const body = {
    active: entity.active,
    income_account: entity.income_account,
    name: entity.name,
    parent_entity: entity.parent_entity,
  }

  const results = await UPDATE<EntityCode>(urlPath, body)

  entityCodes.update((data) => {
    const index = data.findIndex((d) => d.id === entity.id)
    data[index] = results
    return data
  })

  return results
}

//create a new entity code
export const createEntity = async (entity: EntityCode): Promise<EntityCode> => {
  const urlPath = `entity-codes`

  const body = {
    code: entity.code,
    name: entity.name,
    income_account: entity.income_account,
    parent_entity: entity.parent_entity,
    active: entity.active,
  }

  const results = await CREATE<EntityCode>(urlPath, body)

  entityCodes.update((data) => {
    data.push(results)
    return data
  })

  return results
}
