import type { PolicyItem } from './items'
import { dependentsByPolicyId } from './dependents'
import { membersByPolicyId } from './policy-members'

type AccountablePersons = {
  id: string
  name: string
}

export const getPolicyMemberOptions = (policyMembers: any[]): AccountablePersons[] =>
  policyMembers.map((policyMember) => ({
    id: policyMember.id,
    name: policyMember.first_name + ' ' + policyMember.last_name,
  }))

export const getDependentOptions = (dependents: any[]): AccountablePersons[] =>
  dependents.map((dependent) => ({
    id: dependent.id,
    name: dependent.name,
  }))

export const getAccountablePersonsByPolicyId = (id: string): AccountablePersons[] => {
  let dependents: any
  dependentsByPolicyId.subscribe((value) => (dependents = value[id]))
  const dependentOptions = getDependentOptions(dependents)

  let members: any
  membersByPolicyId.subscribe((value) => (members = value[id]))
  const policyMemberOptions = getPolicyMemberOptions(members)

  return [...policyMemberOptions, ...dependentOptions]
}

export const getAccountablePerson = (item: PolicyItem, persons: any): AccountablePersons => {
  const id: any = item.accountable_user_id || item.accountable_dependent_id
  return persons?.find((person: any) => person.id === id)?.name || ''
}
