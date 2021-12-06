import type { UserAppRole } from '../authn/user'
import { readable, writable } from 'svelte/store'
import { route } from '@roxi/routify'

export const selectedPolicyId = readable<string>('', function start(set) {
  // Subscribe to all route changes
  const unsubscriber = route.subscribe((r: any) => {
    // If the route change includes a policyId in the params
    if (r?.params?.policyId) {
      // Then update our store
      set(r.params.policyId)
    }
  })
  return function stop() {
    unsubscriber()
  }
})

export const roleSelection = writable<UserAppRole>()

export const recordRoleSelection = (role: UserAppRole): void => {
  roleSelection.set(role)
}
