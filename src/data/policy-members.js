import { GET } from './index.js'
import { throwError } from '../error'
import { start, stop } from '../components/progress'

/**
 * A function to fetch the items of a policy
 * 
 * @export
 * @param {string} policyId -- The UUID for the desired policy
 * @return {Object[]} 
 */
export async function getPolicyMembers(policyId) {
  start(policyId)

  const policyMembers = await GET(`policies/${policyId}/members`)

  stop(policyId)
  return policyMembers
}
