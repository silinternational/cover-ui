import type { PolicyItem } from './items'
import { dependentsByPolicyId } from './dependents'
import { membersByPolicyId } from './policy-members'

type AccountablePerson = {
  id: string
  name: string
}

export const getPolicyMemberOptions = (policyMembers: any[]): AccountablePerson[] =>
  policyMembers?.map((policyMember) => ({
    id: policyMember.id,
    name: policyMember.first_name + ' ' + policyMember.last_name,
  }))

export const getDependentOptions = (dependents: any[]): AccountablePerson[] =>
  dependents?.map((dependent) => ({
    id: dependent.id,
    name: dependent.name,
  }))

export const getAccountablePersonsByPolicyId = (id: string): AccountablePerson[] => {
  let dependents_value: any
  let members_value: any

  const unsubscribe_dependents = dependentsByPolicyId.subscribe((value) => (dependents_value = value[id] || []))
  const unsubscribe_members = membersByPolicyId.subscribe((value) => (members_value = value[id] || []))

  const dependentOptions = getDependentOptions(dependents_value)
  const policyMemberOptions = getPolicyMemberOptions(members_value)

  unsubscribe_dependents()
  unsubscribe_members()

  return [...policyMemberOptions, ...dependentOptions]
}

export const getAccountablePerson = (item: PolicyItem, persons: any): AccountablePerson => {
  const id: any = item.accountable_user_id || item.accountable_dependent_id
  return persons?.find((person: any) => person.id === id)?.name || ''
}
