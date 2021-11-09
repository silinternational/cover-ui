import { GET } from './index'
import { derived, writable } from 'svelte/store'

export type PolicyMember = {
  email: string
  email_override: string
  first_name: string
  id: string
  last_login_utc: string /*Date*/
  last_name: string
  country: string
}

export const membersByPolicyId = writable<{ [policyId: string]: PolicyMember[] }>({})
export const allPolicyMembers = derived(membersByPolicyId, ($membersByPolicyId) => {
  return Object.values($membersByPolicyId).flat()
})

/**
 * A function to fetch the items of a policy
 *
 * @export
 * @param {string} policyId -- The UUID for the desired policy
 */
export async function loadMembersOfPolicy(policyId: string): Promise<void> {
  const urlPath = `policies/${policyId}/members`

  const policyMembers = await GET<PolicyMember[]>(urlPath)
  membersByPolicyId.update((data) => {
    data[policyId] = policyMembers
    return data
  })
}
