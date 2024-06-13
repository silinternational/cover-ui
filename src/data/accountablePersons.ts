import { PolicyDependent, selectedPolicyDependents } from './dependents'
import { selectedPolicyMembers } from './policy-members'
import type { PolicyMember } from './types/policy-members'
import { derived } from 'svelte/store'

export type AccountablePersonOptions = {
  id: string
  name: string
  country?: string
}

export const getPolicyMemberOptions = (policyMembers: PolicyMember[]): AccountablePersonOptions[] => {
  return policyMembers.map((policyMember) => ({
    id: policyMember.id,
    name: policyMember.first_name + ' ' + policyMember.last_name,
    country: policyMember.country,
  }))
}

export const getDependentOptions = (dependents: PolicyDependent[]): AccountablePersonOptions[] => {
  return dependents.map((dependent) => ({
    id: dependent.id,
    name: dependent.name,
    country: dependent.country,
  }))
}

export const selectedAccountablePersonOptions = derived(
  [selectedPolicyMembers, selectedPolicyDependents],
  ([$selectedPolicyMembers, $selectedPolicyDependents]) => {
    return [...getPolicyMemberOptions($selectedPolicyMembers), ...getDependentOptions($selectedPolicyDependents)]
  }
)
