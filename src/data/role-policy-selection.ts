import type { UserAppRole } from '../authn/user'
import { writable } from 'svelte/store'

export type RolePolicySelection = {
  selectedRole: UserAppRole | undefined
  selectedPolicyId: string | undefined
}

// TODO: Change this to a `readable` to avoid changes by any means other than our provided methods.
export const rolePolicySelection = writable<RolePolicySelection>({
  selectedRole: undefined,
  selectedPolicyId: undefined,
})

export const selectRole = (role: UserAppRole) => {
  rolePolicySelection.update(() => ({
    selectedRole: role,
    selectedPolicyId: undefined,
  }))
}

export const selectPolicy = (policyId: string) => {
  rolePolicySelection.update(() => ({
    selectedRole: 'User',
    selectedPolicyId: policyId,
  }))
}
