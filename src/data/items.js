import { CREATE, DELETE, GET, UPDATE } from "."
import { start, stop } from "../components/progress"
import { throwError } from "../error"
import { writable } from "svelte/store"

export const itemsByPolicyId = writable({})

/**
 * Load the items for the specified policy.
 *
 * @export
 * @param {string} policyId -- The UUID for the desired policy
 */
export async function loadItems(policyId) {
  const urlPath = `policies/${policyId}/items`
  start(urlPath)

  const items = await GET(urlPath)
  itemsByPolicyId.update(data => {
    data[policyId] = items
    return data
  })

  stop(urlPath)
}

/**
 * Add an item.
 *
 * @export
 * @param {string} policyId -- The UUID for the applicable policy
 * @param {Object} itemData
 * @return {Object} 
 */
export async function addItem(policyId, itemData) {
  const urlPath = `policies/${policyId}/items`
  start(urlPath)

  const parsedItemData = {
    category_id: itemData.category,
    country: itemData.country,
    coverage_amount: Number(itemData.marketValueUSD) * 100,
    coverage_start_date: itemData.coverageStartDate,
    coverage_status: itemData.coverage_status,
    description: itemData.itemDescription,
    in_storage: itemData.in_storage,
    make: itemData.make,
    model: itemData.model,
    name: itemData.shortName,
    purchase_date: itemData.purchase_date,
    serial_number: itemData.uniqueIdentifier
  }

  const addedItem = await CREATE(urlPath, parsedItemData)

  itemsByPolicyId.update(data => {
    const items = data[policyId] || []
    items.push(addedItem)
    data[policyId] = items
    return data
  })
  
  stop(urlPath)

  return addedItem
}

/**
 * Update an item.
 *
 * @export
 * @param {string} policyId -- The UUID for the applicable policy
 * @param {Object} itemData
 * @return {Object} 
 */
export async function updateItem(policyId, itemData) {
  const itemId = itemData.id
  if (!itemId) {
    throwError("item id not set")
  }
  const urlPath = `items/${itemId}`
  start(urlPath)

  delete itemData.id
  // TODO: create `parsedItem` to validate item
  const updatedItem = await UPDATE(urlPath, itemData)
  
  itemsByPolicyId.update(data => {
    const items = data[policyId] || []
    const i = items.findIndex(item => item.id === itemId)
    items[i] = updatedItem
    data[policyId] = items
    return data
  })

  stop(urlPath)
  return updatedItem
}

/**
 * Delete an item.
 *
 * @export
 * @param {string} policyId -- The UUID for the applicable policy
 * @param {string} itemId -- The UUID for the item to delete
 */
export async function deleteItem(policyId, itemId) {
  const urlPath = `items/${itemId}`
  start(urlPath)

  await DELETE(urlPath)

  itemsByPolicyId.update(data => {
    const items = data[policyId] || []
    data[policyId] = items.filter(item => item.id !== itemId)
    return data
  })

  stop(urlPath)
}
