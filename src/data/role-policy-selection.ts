import type { UserAppRole } from '../authn/user'
import { get, writable } from 'svelte/store'

export type RolePolicySelection = {
  selectedRole: UserAppRole | undefined
  selectedPolicyId: string | undefined
}

// TODO: Change this to a `readable` to avoid changes by any means other than our provided methods.
export const rolePolicySelection = writable<RolePolicySelection>({
  selectedRole: undefined,
  selectedPolicyId: undefined,
})

export const haveSetRolePolicySelection = writable<boolean>(false)

const recordThatWeHaveSetRolePolicySelection = () => {
  const haveAlreadySet = get(haveSetRolePolicySelection)
  if (!haveAlreadySet) {
    haveSetRolePolicySelection.update(() => true)
  }
}

export const recordRoleSelection = (role: UserAppRole) => {
  recordThatWeHaveSetRolePolicySelection()
  rolePolicySelection.update(() => ({
    selectedRole: role,
    selectedPolicyId: undefined,
  }))
}

export const recordPolicySelection = (policyId: string) => {
  recordThatWeHaveSetRolePolicySelection()
  rolePolicySelection.update(() => ({
    selectedRole: 'User',
    selectedPolicyId: policyId,
  }))
}
