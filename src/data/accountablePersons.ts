import type { PolicyItem } from './items'

export type AccountablePersonOptions = {
  id: string
  name: string
}

export const getPolicyMemberOptions = (policyMembers: any[]): AccountablePersonOptions[] => {
  return policyMembers.map((policyMember) => ({
    id: policyMember.id,
    name: policyMember.first_name + ' ' + policyMember.last_name,
  }))
}

export const getDependentOptions = (dependents: any[]): AccountablePersonOptions[] => {
  return dependents.map((dependent) => ({
    id: dependent.id,
    name: dependent.name,
  }))
}

export const getAccountablePerson = (item: PolicyItem, persons: any): AccountablePersonOptions => {
  const id: any = item.accountable_user_id || item.accountable_dependent_id
  return persons?.find((person: any) => person.id === id) || []
}
