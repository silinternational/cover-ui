import { writable } from 'svelte/store'
import { GET, UPDATE } from './index'

export const policies = writable([])
export const loading = writable(false)
export const initialized = writable(false)

export function init() {
  loadPolicies()
}

/**
 *
 * @description updates a current policy with the given 'policyData'
 * @export
 * @param {Number} id
 * @param {Object} policyData
 * @return {Object} 
 */
export async function updatePolicy(id, policyData) {
  const parsedPolicyData = {
    household_id: policyData.household_id,
    cost_center: policyData.cost_center,
    account: policyData.account,
    entity_code: policyData.entity_code
  }

  const updatedPolicy = await UPDATE(`/policies/${id}`, parsedPolicyData)

  policies.update(currPolicies => {
    let i = currPolicies.findIndex(pol => pol.id === id)
    currPolicies[i] = updatedPolicy
    return currPolicies
  })

  return updatedPolicy
}

export function clear() {
  policies.set([])

  initialized.set(false)
}

export async function loadPolicies() {
  loading.set(true)

  const plcs = await GET('/policies')

  policies.set(plcs)

  loading.set(false)
  initialized.set(true)
}