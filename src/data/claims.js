import { writable } from "svelte/store";

export const claims = writable([
  {
    name: "Saxophone",
    accountable_person: "John Russel",
    last_changed: "5 days",
    state: { icon: 'message' },
    title: "Awaiting review",
    message: "Submitted 5 days ago"
  },
  {
    name: "GoPro",
    accountable_person: "Priscilla Russel",
    last_changed: "2 weeks",
    state: { icon: 'message' },
    title: "Awaiting review",
    message: "Submitted 2 weeks ago",
  },
])
export const loading = writable(false)
export const initialized = writable(true)
export const states = {
    message: {
        icon: 'chat',
        color: '--mdc-theme-primary',
        bgColor: '--mdc-theme-primary-header-bg',
        title: 'From '
    },
    draft: {
        icon: 'edit',
        color: '--mdc-theme-primary',
        bgColor: '--mdc-theme-primary-header-bg',
        title: 'Draft'
    },
    awaiting: {
        icon: 'watch_later',
        color: '--mdc-theme-neutral-variant',
        bgColor: '--mdc-theme-neutral-bg',
        title: 'Awaiting review'
    },
    needsChanges: {
        icon: 'error',
        color: '--mdc-theme-status-warning',
        bgColor: '--mdc-theme-status-warning-bg',
        title: 'Needs changes'
    },
    denied: {
        icon: 'remove_circle',
        color: '--mdc-theme-status-error',
        bgColor: '--mdc-theme-status-error-bg',
        title: 'Denied'
    },
    approvedRepair: {
        icon: 'done',
        color: '--mdc-theme-status-success',
        bgColor: '--mdc-theme-status-success-bg',
        title: 'Approved for repair'
    },
    payout: {
        icon: 'paid',
        color: '--mdc-theme-status-success',
        bgColor: '--mdc-theme-status-success-bg',
        title: 'Approved for payout'
    },
    complete: {
        icon: 'paid',
        color: '--mdc-theme-status-success',
        bgColor: '--mdc-theme-status-success-bg',
        title: 'Complete'
    }
}

// TODO: add backend endpoints when they get finished
// TODO: uncomment when backend has claims endpoints
/*
export function init() {
    loadClaims()
}
*/

/**
 *
 * @description a function to create a new claim for an existing item
 * @export
 * @param {Object} item
 * @param {Object} claimData
 */
export async function createClaim(item, claimData) {
  loading.set(true)

  // TODO: make an item field to store details about claim item
  let parsedClaim = {
    item_id: item.id,
    name: item.item_name,
    accountable_person: item.accountable_person,
    state: { icon: 'message' },
    title: "Awaiting review",
    last_changed: "Now",
    message: "Submitted Now",
    lost_date: claimData.lostDate,
    loss_reason: claimData.loss_reason,
    description: claimData.situationDescription,
    fair_market_value: claimData.fairMarketValue,
    is_repairable: claimData.isRepairable,
    repair_cost: claimData.repair_cost,
  }

  claims.update(currClaims => {
    currClaims.push(parsedClaim)
    return currClaims
  })

  loading.set(false)
}

export function getClaim(claims, itemId) {
  return claims.find(clm => clm.itemId === itemId)
}

/**
 *
 * @description a function to update a claim
 * @export
 * @param {Number} itemId
 * @param {Object} newClaimData
 */
export function updateClaim(itemId, newClaimData) {
    loading.set(true)

    newClaimData.itemId = itemId

    claims.update(currClaims => {
      let i = currClaims.findIndex(clm => clm.itemId === itemId)
      currClaims[i] = newClaimData
      return currClaims
    })

    loading.set(false)
}

/**
 *
 * @description a function to delete a claim
 * @export
 * @param {Number} itemId 
 */
export function deleteClaim(itemId) {
  loading.set(true)

  claims.update(currClaims => currClaims.filter(clm => clm.itemId !== itemId))

  loading.set(false)
}

export function clear() {
  claims.set([])
  initialized.set(false)
}

/*
export function loadClaims() {
    loading.set(true)

    let clms = await GET('claims')

    claims.set(clms)

    loading.set(false)
    initialized.set(true)
}
*/