import { writable } from 'svelte/store'
import { GET, POST, UPDATE, DELETE } from './index'

export const policies = writable([])
export const loading = writable(false)
export const initialized = writable(false)

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

    const updatedPolicy = await UPDATE(`/policies/${id}`, parsedPolicyData)

    policies.update(currPolicies => {
        let i = currPolicies.findIndex(pol => pol.id === id)
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
export async function getItems(policyId) {
    loading.set(true)

    const items = await GET(`/policies/${policyId}/items`)

    loading.set(false)
    return items
}

/**
 *
 * @description a function to create an item
 * @export
 * @param {Number} policyId
 * @param {Object} itemData
 * @return {Object} 
 */
export async function addItem(policyId, itemData) {
    const parsedItemData = {
        name: itemData.shortName,
        category_name: itemData.riskCategory,
        country: itemData.country,
        description: itemData.itemDescription,
        make: itemData.make,
        model: itemData.model,
        serial_number: itemData.uniqueIdentifier,
        accountable_person: itemData.accountablePersonUuid,
    }

    const item = await POST(`/policies/${policyId}/items`, parsedItemData)

    return item
}

export function clear() {
    policies.set([])

    initialized.set(false)
}

export async function loadPolicies() {
    loading.set(true)

    const plcs = await GET('/policies')

    policies.set(plcs)

    loading.set(false)
    initialized.set(true)
}