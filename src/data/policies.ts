import { derived, get, writable } from 'svelte/store'
import type { Claim } from './claims'
import { CREATE, GET, UPDATE } from './index'
import type { PolicyMember } from './policy-members'
import type { PolicyDependent } from './dependents'
import { selectedPolicyId } from './role-policy-selection'
import type { EntityCode } from './entityCodes'
import qs from 'qs'

export type Policy = {
  account: string
  account_detail: string
  claims?: Claim[]
  cost_center: string
  created_at: string /*Date*/
  dependents?: PolicyDependent[]
  entity_code: EntityCode
  household_id: string
  id: string
  members?: PolicyMember[]
  name: string
  type: PolicyType
  updated_at: string /*Date*/
}

export enum PolicyType {
  Household = 'Household',
  Team = 'Team',
}

export type CreatePolicyRequestBody = {
  account: string
  account_detail?: string
  cost_center: string
  entity_code: string
  name: string
}

export type UpdatePolicyRequestBody = {
  account?: string
  account_detail?: string
  cost_center?: string
  entity_code?: string
  household_id?: any /* This seemed complicated */
  name?: string
}

export const policies = writable<Policy[]>([])
export const selectedPolicy = derived([policies, selectedPolicyId], ([$policies, $selectedPolicyId]) => {
  return $policies.find((p) => p.id === $selectedPolicyId) || ({} as Policy)
})
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
export async function updatePolicy(id: string, policyData: UpdatePolicyRequestBody): Promise<void> {
  const updatedPolicy = await UPDATE<Policy>(`policies/${id}`, policyData)

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
export async function createPolicy(policyData: CreatePolicyRequestBody): Promise<Policy> {
  const createdPolicy = await CREATE<Policy>('policies', policyData)
  updatePoliciesStore(createdPolicy)
  return createdPolicy
}

export function clear(): void {
  policies.set([])

  initialized.set(false)
}

export const getNameOfPolicy = (policy: Policy): string => {
  let policyName = ''
  if (policy?.name) {
    policyName = policy.name
  } else {
    if (policy?.type === PolicyType.Team) {
      policyName = 'Team'
    } else if (policy?.type === PolicyType.Household) {
      const members = policy?.members || []
      const lastName = members[0]?.last_name || ''
      policyName = lastName + ' Household'
    }
  }
  return policyName.trim()
}

//claims or members/dependents fields from this endpoint are deprecated
export async function loadPolicies(): Promise<void> {
  const response = await GET<{ data: Policy[]; meta: unknown }>('policies')
  const data = response.data
  policies.set(data)
  initialized.set(true)
}

export async function loadPolicy(policyId: string): Promise<Policy> {
  const response = await GET<Policy>(`policies/${policyId}`)

  updatePoliciesStore(response)

  return response
}

export async function searchPoliciesFor(searchText: string): Promise<Policy[]> {
  const queryString = qs.stringify({ search: searchText })
  const response = await GET<{ data: Policy[]; meta: unknown }>(`policies?${queryString}`)
  return response.data
}

export const getPolicyById = (policyId: string): Policy => {
  const policy = get(policies).find((policy) => policy.id === policyId) || ({} as Policy)
  return policy
}

export const memberBelongsToPolicy = (memberId: string, policies: Policy[], policyId: string): boolean => {
  const policy = policies?.find((p) => p.id === policyId)
  const member = policy?.members?.find((m) => m.id === memberId)

  return !!member
}
