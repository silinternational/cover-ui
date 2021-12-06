import { loadUser, updateUserPolicyStore } from '../authn/user'
import { derived, get, writable } from 'svelte/store'
import type { Claim } from './claims'
import { CREATE, GET, UPDATE } from './index'
import type { PolicyMember } from './policy-members'
import { selectedPolicyId } from './role-policy-selection'
import qs from 'qs'

export type Policy = {
  account: string
  account_detail: string
  claims?: Claim[]
  cost_center: string
  created_at: string /*Date*/
  dependents?: any[] /*PolicyDependent*/
  entity_code: any /*EntityCode*/
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

  updatePoliciesStore(updatedPolicy)
  updateUserPolicyStore(updatedPolicy)
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
    account_detail: policyFormData.accountDetail,
    cost_center: policyFormData.costCenter,
    entity_code: policyFormData.entityCode,
    name: policyFormData.policyName,
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
export async function loadPolicies(limit = 20): Promise<void> {
  const queryString = qs.stringify({ limit })
  const response = await GET<{ data: Policy[]; meta: any }>(`policies?${queryString}`)
  const data = response.data
  policies.set(data)
  data.length && initialized.set(true)
}

export async function loadPolicy(policyId: string): Promise<Policy> {
  const response = await GET<Policy>(`policies/${policyId}`)

  updatePoliciesStore(response)

  return response
}

export async function searchPoliciesFor(searchText: string, limit = 50): Promise<Policy[]> {
  const queryString = qs.stringify({ search: searchText, limit })
  const response = await GET<{ data: Policy[]; meta: any }>(`policies?${queryString}`)
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
