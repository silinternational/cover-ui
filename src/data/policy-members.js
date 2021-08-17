import { GET } from './index.js'
import { start, stop } from '../components/progress'
import { writable } from 'svelte/store'

export const membersByPolicyId = writable({})

/**
 * A function to fetch the items of a policy
 * 
 * @export
 * @param {string} policyId -- The UUID for the desired policy
 * @return {Object[]} 
 */
export async function loadMembersOfPolicy(policyId) {
  const urlPath = `policies/${policyId}/members`
  start(urlPath)

  const policyMembers = await GET(urlPath)
  membersByPolicyId.update(data => {
    data[policyId] = policyMembers
    return data
  })

  stop(urlPath)
}
