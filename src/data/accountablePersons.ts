export type AccountablePersonOptions = {
  id: string
  name: string
  country?: string
}

export const getPolicyMemberOptions = (policyMembers: any[]): AccountablePersonOptions[] => {
  return policyMembers.map((policyMember) => ({
    id: policyMember.id,
    name: policyMember.first_name + ' ' + policyMember.last_name,
    country: policyMember.country,
  }))
}

export const getDependentOptions = (dependents: any[]): AccountablePersonOptions[] => {
  return dependents.map((dependent) => ({
    id: dependent.id,
    name: dependent.name,
    country: dependent.country,
  }))
}
