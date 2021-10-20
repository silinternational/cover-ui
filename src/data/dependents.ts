import { CREATE, GET } from '.'
import { writable } from 'svelte/store'

export type PolicyDependent = {
  child_birth_year?: number
  id: string
  country: string
  name: string
  relationship: /*PolicyDependentRelationship*/ 'Spouse' | 'Child'
}

export type CreatePolicyDependentRequestBody = {
  child_birth_year: number
  country: string
  name: string
  relationship: /*PolicyDependentRelationship*/ 'Spouse' | 'Child'
}

export type UpdatePolicyDependentRequestBody = {
  child_birth_year: number
  id: string
  country: string
  name: string
  relationship: /*PolicyDependentRelationship*/ 'Spouse' | 'Child'
}

export const dependentsByPolicyId = writable<{ [policyId: string]: PolicyDependent[] }>({})

/**
 *
 * @description a function to create a dependent for a certain policy
 * @export
 * @param {string} policyId -- The UUID for the desired policy
 * @param {Object} depData
 */
export async function addDependent(policyId: string, depData: any): Promise<void> {
  const urlPath = `policies/${policyId}/dependents`

  const parsedDep: CreatePolicyDependentRequestBody = {
    name: depData.name,
    relationship: depData.relationship,
    country: depData.country,
    child_birth_year: depData.childBirthYear && parseInt(depData.childBirthYear),
  }

  const addedDependent = await CREATE<PolicyDependent>(urlPath, parsedDep)

  dependentsByPolicyId.update((data) => {
    const dependents = data[policyId] || []
    dependents.push(addedDependent)
    data[policyId] = dependents
    return data
  })
}

/**
 *
 * @description a function to delete a dependent
 * @export
 * @param {string} policyId -- The UUID for the applicable policy
 * @param {string} dependentId -- The UUID for the desired dependent
 */
export async function deleteDependent(policyId: string, dependentId: string): Promise<void> {
  const urlPath = `dependents/${dependentId}`

  // TODO: uncomment when endpoint is finished
  // const response = await DELETE<...>(urlPath)

  dependentsByPolicyId.update((data) => {
    const dependents = data[policyId] || []
    data[policyId] = dependents.filter((dependent) => dependent.id !== dependentId)
    return data
  })
}

/**
 *
 * @description a function to update a dependent
 * @export
 * @param {string} policyId -- The UUID for the applicable policy
 * @param {string} dependentId -- The UUID for the desired dependent
 * @param {Object} depData
 */
export async function updateDependent(policyId: string, dependentId: string, depData: any): Promise<void> {
  const urlPath = `dependents/${dependentId}`

  const parsedDep: UpdatePolicyDependentRequestBody = {
    id: dependentId,
    name: depData.name,
    relationship: depData.relationship,
    country: depData.country,
    child_birth_year: depData.childBirthYear,
  }

  // TODO: uncomment when endpoint is finished
  // const updatedDependent = await UPDATE<PolicyDependent>(urlPath)
  const updatedDependent = parsedDep // TEMP - until we can use API return value.

  dependentsByPolicyId.update((data) => {
    const dependents = data[policyId] || []
    const i = dependents.findIndex((dependent) => dependent.id === dependentId)
    dependents[i] = updatedDependent
    data[policyId] = dependents
    return data
  })
}

/**
 *
 * @description a function to load the dependents of a policy
 * @param {string} policyId -- The UUID for the desired policy
 * @export
 */
export async function loadDependents(policyId: string): Promise<void> {
  const urlPath = `policies/${policyId}/dependents`

  const loadedDependents = await GET<PolicyDependent[]>(urlPath)
  dependentsByPolicyId.update((data) => {
    data[policyId] = loadedDependents
    return data
  })
}
