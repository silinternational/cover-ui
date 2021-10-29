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
    haveSetRolePolicySelection.set(true)
  }
}

export const recordRoleSelection = (role: UserAppRole) => {
  recordThatWeHaveSetRolePolicySelection()
  rolePolicySelection.set({
    selectedRole: role,
    selectedPolicyId: undefined,
  })
}

export const recordPolicySelection = (policyId: string) => {
  recordThatWeHaveSetRolePolicySelection()
  rolePolicySelection.set({
    selectedRole: 'User',
    selectedPolicyId: policyId,
  })
}

const isAdminRole = (role: UserAppRole | undefined) => role && ['Signator', 'Steward'].includes(role)

export const reactToUrlChanges = (urlPolicyId: string | undefined) => {
  if (urlPolicyId) {
    const { selectedRole } = get(rolePolicySelection)
    isAdminRole(selectedRole) || recordPolicySelection(urlPolicyId)
  }
}
