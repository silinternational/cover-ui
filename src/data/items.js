import { CREATE, DELETE, GET, UPDATE } from "./index.js"
import { throwError } from "../error"
import { start, stop } from "../components/progress/index.js"
import { writable } from "svelte/store"

const items = writable([])

/**
 *
 * @description a function to fetch the items of a policy
 * @export
 * @param {string} policyId -- The UUID for the desired policy
 * @return {Object} 
 */
export async function getItems(policyId) {
  start(policyId)

  const items = await GET(`policies/${policyId}/items`)

  stop(policyId)
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
  start(policyId)

  const parsedItemData = {
    category_id: itemData.category,
    country: itemData.country,
    coverage_amount: Number(itemData.marketValueUSD),
    coverage_start_date: itemData.coverage_start_date,
    coverage_status: itemData.coverage_status,
    description: itemData.itemDescription,
    in_storage: itemData.in_storage,
    make: itemData.make,
    model: itemData.model,
    name: itemData.shortName,
    purchase_date: itemData.purchase_date,
    serial_number: itemData.uniqueIdentifier
  }

  const item = await CREATE(`policies/${policyId}/items`, parsedItemData)

  stop(policyId)

  items.push(item)

  return item
}

/**
 *
 * @description a function to update an item
 * @export
 * @param {Object} item
 * @return {Object} 
 */
export async function updateItem(item) {
  if (!item.id) throwError("item id not set")
  
  start(item.id)

  let itemId = item.id
  delete item.id
  // TODO: create `parsedItem` to validate item
  let newItem = await UPDATE(`items/${itemId}`, item)

  stop(itemId)
  return newItem
}

/**
 *
 * @description a function to delete an item
 * @export
 * @param {Number} id
 * @return {null} 
 */
export async function deleteItem(id) {
  start(id)

  await DELETE(`items/${id}`)

  stop(id)
}
