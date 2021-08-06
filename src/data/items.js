import { DELETE, UPDATE } from "./index.js";
import { throwError } from "../error";
import { writable } from "svelte/store";

export const loading = writable(false)

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

/**
 *
 * @description a function to update an item
 * @export
 * @param {Object} item
 * @return {Object} 
 */
export async function updateItem(item) {
  if (!item.id) throwError("item id not set")
  
  loading.set(true)

  let itemId = item.id
  delete item.id
  // TODO: create `parsedItem` to validate item
  let item = await UPDATE(`/items/${itemId}`, item)

  loading.set(false)
  return item
}

/**
 *
 * @description a function to delete an item
 * @export
 * @param {Number} id
 * @return {null} 
 */
export async function deleteItem(id) {
  loading.set(true)

  await DELETE(`/items/${id}`)

  loading.set(false)
  return null
}