import { GET, CREATE as POST, DELETE } from './index'
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
export async function deletePolicyMember(policyMemberId: string): Promise<void> {
  await DELETE<void>(`policy-members/${policyMemberId}`)

  membersByPolicyId.update((data) => {
    const entries = Object.entries(data)
    const entryWithMemberToDelete = entries.find((entry) =>
      entry[1].some((member) => member.policy_user_id === policyMemberId)
    )
    const policyId = entryWithMemberToDelete?.[0]
    const memberToDelete = entryWithMemberToDelete?.[1].find((member) => member.policy_user_id === policyMemberId)
    const memberId = memberToDelete?.id
    if (policyId) {
      data[policyId] = data[policyId].filter((member) => member.id !== memberId)
    }
    return data
  })
}
