import type { UserAppRole } from '../authn/user'
import { readable, writable } from 'svelte/store'
import { route } from '@roxi/routify'

export const selectedPolicyId = readable<string>('', function start(set) {
  const unsubscriber = route.subscribe((r: any) => {
    if (r?.params?.policyId) {
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
