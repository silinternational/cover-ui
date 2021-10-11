import { claims } from 'data/claims'
import { dependentsByPolicyId } from 'data/dependents'
import { itemsByPolicyId } from 'data/items'
import { policies } from 'data/policies'
import { toTitleCase } from 'helpers/strings'
import user from '../authn/user'
import t from '../i18n'
import { get, writable } from 'svelte/store'

export const pageTitle = writable<string>(t('appname'))

const getChunkValue = (key: string, id: string): string => {
  switch (key) {
    case ':claimId': {
      const claim = get(claims).find((c) => c.id === id)
      const claimItem = claim?.claim_items[0]
      const policyItems = claim ? get(itemsByPolicyId)[claim?.policy_id] : []
      const policyItem = policyItems.find((pi) => pi.id === claimItem?.item_id)
      return policyItem ? `${policyItem?.name} (${claim?.reference_number})` : '_blank'
    }
    case ':itemId': {
      const userObj = get(user)
      const policy = get(policies).find((p) => p.id === userObj?.policy_id)
      const policyItems = policy ? get(itemsByPolicyId)[policy?.id] : []
      const policyItem = policyItems.find((pi) => pi.id === id)
      return policyItem ? `${policyItem?.name}` : '_blank'
    }
    case ':uuid': {
      const userObj = get(user)
      const policy = get(policies).find((p) => p.id === userObj?.policy_id)
      const dependents = policy ? get(dependentsByPolicyId)[policy?.id] : []
      const dependent = dependents.find((d) => d.id === id)
      return dependent ? `${dependent.name}` : '_blank'
    }
    case 'newClaim':
      return 'New'
    case 'new-claim':
      return 'New Claim'
    default:
      return key
  }
}

export const updatePageTitle = (path: string): string => {
  // TODO: Ok so there's a big problem here and that's when we try to create the page title before the above stores are
  // populated. This occurs on initial page load. In that case we cannot resolve values for claimId, itemId, or uuid
  // We can just ignore this case for now.

  const blacklist = ['_blank', '_fallback', 'customer', ':policyId'] // don't show in the title

  const pathChunks = path.split('/')

  const lChunks = location.pathname.split('/')
  const title = pathChunks
    .map((i, idx) => getChunkValue(i, lChunks[idx]))
    .filter((i) => !blacklist.includes(i))
    .map(toTitleCase)
    .join(' > ')

  pageTitle.update(() => `${t('appname')} ${title}`)

  return title
}
