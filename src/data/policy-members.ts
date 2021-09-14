import { GET } from './index'
import { start, stop } from '../components/progress'
import { writable } from 'svelte/store'

export type PolicyMember = {
  email: string;
  email_override: string;
  first_name: string;
  id: string;
  last_login_utc: string /*Date*/;
  last_name: string;
  location: string;
};

export const membersByPolicyId = writable<{ [policyId: string]: PolicyMember[] }>({})

/**
 * A function to fetch the items of a policy
 * 
 * @export
 * @param {string} policyId -- The UUID for the desired policy
 * @return {void} 
 */
export async function loadMembersOfPolicy(policyId: string) {
  const urlPath = `policies/${policyId}/members`
  start(urlPath)

  const policyMembers = await GET<PolicyMember[]>(urlPath)
  membersByPolicyId.update(data => {
    data[policyId] = policyMembers
    return data
  })

  stop(urlPath)
}
