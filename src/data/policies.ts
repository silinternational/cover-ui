import { loadUser } from '../authn/user'
import { get, writable } from 'svelte/store'
import type { Claim } from './claims'
import { CREATE, GET, UPDATE } from './index'
import type { PolicyMember } from './policy-members'

export type Policy = {
  account: string
  claims?: Claim[]
  cost_center: string
  created_at: string /*Date*/
  dependents?: any[] /*PolicyDependent*/
  entity_code: any /*EntityCode*/
  household_id: string
  id: string
  members?: PolicyMember[]
  type: PolicyType
  updated_at: string /*Date*/
}

export type PolicyType = 'Household' | 'Corporate'

export type CreatePolicyRequestBody = {
  account: string
  account_detail: string
  cost_center: string
  entity_code: string
}

export type UpdatePolicyRequestBody = {
  account: string
  cost_center: string
  entity_code: string
  household_id: any /* This seemed complicated */
}

export const policies = writable<Policy[]>([])
export const initialized = writable<boolean>(false)

/**
 * Update a policy in our local list (store) of policies.
 *
 * @param {Policy} changedPolicy
 */
const updatePoliciesStore = (changedPolicy: Policy) => {
  policies.update((policies) => {
    const i = policies.findIndex((policy) => policy.id === changedPolicy.id)
    if (i === -1) {
      policies.push(changedPolicy)
    } else {
      policies[i] = changedPolicy
    }
    return policies
  })
}

/**
 *
 * @description updates a current policy with the given 'policyData'
 * @export
 * @param {Number} id
 * @param {Object} policyData
 */
export async function updatePolicy(id: string, policyData: any): Promise<void> {
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
}

/**
 * Create a new policy
 *
 * @export
 * @param {Object} policyFormData
 */
export async function createPolicy(policyFormData: any): Promise<Policy> {
  const parsedPolicyData: CreatePolicyRequestBody = {
    account: policyFormData.account,
    account_detail: policyFormData.groupName,
    cost_center: policyFormData.costCenter,
    entity_code: policyFormData.entityCode,
  }
  const createdPolicy = await CREATE<Policy>('policies', parsedPolicyData)
  updatePoliciesStore(createdPolicy)
  loadUser(true) // Don't wait, just refresh user's policies in the background.
  return createdPolicy
}

export function clear(): void {
  policies.set([])

  initialized.set(false)
}

//claims or members/dependents fields from this endpoint are deprecated
export async function loadPolicies(): Promise<void> {
  const response = await GET<{ data: Policy[]; meta: any }>('policies')
  const data = response.data
  policies.set(data)
  initialized.set(true)
}

export async function loadPolicy(policyId: string): Promise<Policy> {
  const response = await GET<Policy>(`policies/${policyId}`)

  updatePoliciesStore(response)

  return response
}

export const affiliations = writable<{ [key: string]: string }>({
  SIL: 'SIL International',
})

export const getPolicyById = (policyId: string): Policy => {
  const policy = get(policies).find((policy) => policy.id === policyId) || ({} as Policy)
  return policy
}
