import { writable } from 'svelte/store'
import { start, stop } from '../components/progress'
import type { Claim } from './claims'
import { GET, UPDATE } from './index'
import type { PolicyMember } from './policy-members'

export type Policy = {
  account: string
  claims: Claim[]
  cost_center: string
  created_at: string /*Date*/
  dependents: any[] /*PolicyDependent*/
  entity_code: any /*EntityCode*/
  household_id: string
  id: string
  members: PolicyMember[]
  type: PolicyType
  updated_at: string /*Date*/
}

export type PolicyType = 'Household' | 'Corporate'

export type UpdatePolicyRequestBody = {
  account: string
  cost_center: string
  entity_code: string
  household_id: any /* This seemed complicated */
}

export const policies = writable<Policy[]>([])
export const initialized = writable<boolean>(false)

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
export async function updatePolicy(id: string, policyData) {
  const parsedPolicyData: UpdatePolicyRequestBody = {
    household_id: policyData.household_id,
    cost_center: policyData.cost_center,
    account: policyData.account,
    entity_code: policyData.entity_code,
  }

  const updatedPolicy = await UPDATE<Policy>(`policies/${id}`, parsedPolicyData)

  policies.update((currPolicies) => {
    const i = currPolicies.findIndex((pol) => pol.id === id)
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
  start('loadPolicies')

  const plcs = await GET<Policy[]>('policies')

  policies.set(plcs)

  stop('loadPolicies')
  initialized.set(true)
}

export const affiliations = writable({
  SIL: 'SIL International',
})
