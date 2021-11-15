import { CREATE, DELETE, GET, UPDATE } from '.'
import { derived, writable } from 'svelte/store'
import { selectedPolicyId } from './role-policy-selection'

export type PolicyDependentRelationship = 'Spouse' | 'Child' | 'None'

export type PolicyDependent = {
  id: string
  country: string
  name: string
  relationship: PolicyDependentRelationship
  child_birth_year: number
}

export type CreatePolicyDependentRequestBody = {
  child_birth_year: number
  country: string
  name: string
  relationship: PolicyDependentRelationship
}

export type UpdatePolicyDependentRequestBody = {
  child_birth_year: number
  country: string
  name: string
  relationship: PolicyDependentRelationship
}

export const dependentsByPolicyId = writable<{ [policyId: string]: PolicyDependent[] }>({})
export const selectedPolicyDependents = derived(
  [dependentsByPolicyId, selectedPolicyId],
  ([$dependentsByPolicyId, $selectedPolicyId]) => {
    return $dependentsByPolicyId[$selectedPolicyId] || []
  }
)
export const allPolicyDependents = derived(dependentsByPolicyId, ($dependentsByPolicyId) => {
  return Object.values($dependentsByPolicyId).flat()
})

/**
 *
 * @description a function to create a dependent for a certain policy
 * @export
 * @param policyId -- The UUID for the desired policy
 * @param depData
 */
export async function addDependent(policyId: string, depData: CreatePolicyDependentRequestBody): Promise<void> {
  const urlPath = `policies/${policyId}/dependents`

  const addedDependent = await CREATE<PolicyDependent>(urlPath, depData)

  dependentsByPolicyId.update((data) => {
    const dependents = data[policyId] || []
    dependents.push(addedDependent)
    data[policyId] = dependents
    return data
  })
}

/**
 * Delete a dependent from a Policy.
 *
 * @export
 * @param {string} policyId -- The UUID for the applicable policy
 * @param {string} dependentId -- The UUID for the desired dependent
 */
export async function deleteDependent(policyId: string, dependentId: string): Promise<void> {
  await DELETE(`policy-dependents/${dependentId}`)
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
export async function updateDependent(
  policyId: string,
  dependentId: string,
  depData: UpdatePolicyDependentRequestBody
): Promise<void> {
  const urlPath = `policy-dependents/${dependentId}`

  const updatedDependent = await UPDATE<PolicyDependent>(urlPath, depData)

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
