import { CREATE, DELETE, UPDATE } from "./index.js";
import { throwError } from "../error";
import { writable } from "svelte/store";

export const loading = writable(false)

const exampleItems = [
  {
    id: "0e3ed6ce-f6de-11eb-9a03-0242ac130003",
    item_name: "Laptop",
    recent_activity: "Awaiting approval",
    accountable_person: "John Smith",
    coverage_amount: 650,
    premium: 20,
    type: "Mobile",
    make: "Lenovo",
    model: "Ideapad 14 5",
    serial_number: "2009d-asdddd",
    description: "My humble laptop"
  }, 
  {
    id: "38573852-f6de-11eb-9a03-0242ac130003",
    item_name: "Favorite Couch",
    recent_activity: "Added 3 months ago",
    accountable_person: "Mary Smith",
    coverage_amount: 200,
    premium: 6,
    type: "Stationary",
    make: "Vader Furniture",
    model: "v1 X",
    serial_number: "03810345",
    description: "My couch that I've had for 10 years"
  }, 
  {
    id: "6402a540-f6de-11eb-9a03-0242ac130003",
    item_name: "Samsung S21",
    recent_activity: "Removed 3 days ago",
    accountable_person: "George Smith",
    coverage_amount: 950,
    premium: 30,
    type: "Mobile",
    make: "Samsung",
    model: "Galaxy S21",
    serial_number: "123456",
    description: "My awesome phone that I don't want to lose"
  }
]

/**
 *
 * @description a function to fetch the items of a policy
 * @export
 * @param {Number} id
 * @return {Object} 
 */
export async function getItems(policyId) {
  loading.set(true)

  // TODO: finish this when endpoint is done
  // const items = await GET(`policies/${policyId}/items`)

  loading.set(false)
  return exampleItems
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
    name: itemData.shortName,
    category_name: itemData.riskCategory,
    country: itemData.country,
    description: itemData.itemDescription,
    make: itemData.make,
    model: itemData.model,
    serial_number: itemData.uniqueIdentifier,
    accountable_person: {
      name: itemData.accountablePersonName,
      uuid: itemData.accountablePersonUuid,
    },
    cost: itemData.itemCostUSD,
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
  
  loading.set(true)

  let itemId = item.id
  delete item.id
  // TODO: create `parsedItem` to validate item
  let item = await UPDATE(`items/${itemId}`, item)

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

  await DELETE(`items/${id}`)

  loading.set(false)
}