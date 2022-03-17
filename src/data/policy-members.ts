import { GET, CREATE as POST } from './index'
import { loadPolicy } from './policies'
import { selectedPolicyId } from './role-policy-selection'
import type { PolicyMember } from './types/policy-members'
import { derived, writable } from 'svelte/store'

export const membersByPolicyId = writable<{ [policyId: string]: PolicyMember[] }>({})
export const selectedPolicyMembers = derived(
  [membersByPolicyId, selectedPolicyId],
  ([$membersByPolicyId, $selectedPolicyId]) => {
    return $membersByPolicyId[$selectedPolicyId] || []
  }
)
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

export async function invitePolicyMember(
  policyId: string,
  name: string,
  email: string,
  message: string
): Promise<void> {
  const urlPath = `policies/${policyId}/members`

  await POST<void>(urlPath, {
    email,
    name,
    inviter_message: message,
  })
  loadPolicy(policyId)
}
