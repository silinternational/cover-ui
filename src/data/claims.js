import { writable } from "svelte/store";

export const claims = writable([])
export const loading = writable(false)
export const initialized = writable(true)  

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
 * @param {Number} itemId
 * @param {Object} claimData
 */
export function createClaim(itemId, claimData) {
    loading.set(true)

    claimData.itemId = itemId

    claims.update(currClaims => currClaims.push(claimData))

    loading.set(false)

    return null
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

    return null
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

    return null
}

export function clear() {
    claims.set([])
    initialized.set(false)
}

/*
export function loadClaims() {
    loading.set(true)

    let clms = await GET('/claims')

    claims.set(clms)

    loading.set(false)
    initialized.set(true)
}
*/