import { writable } from 'svelte/store'
import { GET, POST, PUT, DELETE } from './index'

export const policies = writable([])
export const loading = writable(false)
export const isInitialized = writable(false)

export function init() {
    loadPolicies()
}

/**
 *
 * @description updates a current policy with the given 'policyData'
 * @export
 * @param {Number} id
 * @param {Object} policyData
 * @return {Object} 
 */
export async function updatePolicy(id, policyData) {
    const parsedPolicyData = {
        household_id: policyData.household_id,
        cost_center: policyData.cost_center,
        account: policyData.account,
        entity_code: policyData.entity_code
    }

    const updatedPolicy = await PUT(`/policies/${id}`, parsedPolicyData)

    policies.update(currPolicies => {
        let i = currPolicies.findIndex(pol => pol.id == id)
        currPolicies[i] = updatedPolicy
        return currPolicies
    })

    return updatedPolicy
}

/**
 *
 * @description a function to fetch the items of a policy
 * @export
 * @param {Number} id
 * @return {Object} 
 */
export async function getItems(id) {
    loading.set(true)

    const items = await GET(`/policies/${id}/items`)

    loading.set(false)
    return items
}

/**
 *
 * @description a function to create an item
 * @export
 * @param {Number} id
 * @param {Object} itemData
 * @return {Object} 
 */
export async function addItem(id, itemData) {
    const parsedItemData = {
        name: itemData.name,
        category_id: itemData.category_id,
        country: itemData.country,
        description: itemData.description,
        make: itemData.make,
        model: itemData.model,
        serial_number: itemData.serial_number,
    }

    const item = await POST(`/policies/${id}/items`, parsedItemData)

    return item
}

export function clear() {
    policies.set([])

    isInitialized.set(false)
}

async function loadPolicies() {
    loading.set(true)

    const plcs = await GET('/policies')

    policies.set(plcs)

    loading.set(false)
    isInitialized.set(true)
}