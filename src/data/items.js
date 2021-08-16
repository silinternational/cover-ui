import { CREATE, DELETE, GET, UPDATE } from "./index.js"
import { throwError } from "../error"
import { start, stop } from "../components/progress/index.js"


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
  const parsedItemData = {
    id: "fb34d3d4-f6de-11eb-9a03-0242ac130003",
    item_name: itemData.shortName,
    type: itemData.category.name,
    country: itemData.country,
    description: itemData.itemDescription,
    make: itemData.make,
    model: itemData.model,
    serial_number: itemData.uniqueIdentifier,
    accountable_person: itemData.accountablePersonName,
    coverage_amount: itemData.marketValueUSD,
    recent_activity: "Added just now",
    premium: itemData.marketValueUSD*0.05
  }

  // const item = await CREATE(`policies/${policyId}/items`, parsedItemData)

  // TODO: change this when endpoint is done and push item
  exampleItems.push(parsedItemData)

  return parsedItemData
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
