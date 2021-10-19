import { CREATE, DELETE, GET, UPDATE } from '.'
import { throwError } from '../error'
import { writable } from 'svelte/store'

export type ItemCoverageStatus = 'Draft' | 'Pending' | 'Approved' | 'Denied' | 'Inactive'

export type RiskCategory = {
  created_at: string /*Date*/
  id: string
  name: string
  policy_max: number
  updated_at: string /*Date*/
}

export type PolicyItem = {
  accountable_person_id?: string
  accountable_dependent_id?: string
  accountable_user_id?: string
  annual_premium: number
  category: any /*ItemCategory*/
  country: string
  coverage_amount: number
  coverage_start_date: string /* yyyy-mm-dd Date */
  coverage_status: ItemCoverageStatus
  created_at: string /*Date*/
  description: string
  id: string
  in_storage: boolean
  make: string
  model: string
  name: string
  policy_id: string
  purchase_date: string /* yyyy-mm-dd Date */
  risk_category: RiskCategory
  serial_number: string
  status_change: string
  updated_at: string /*Date*/
}

export type CreatePolicyItemRequestBody = {
  accountable_person_id: string /*UUID*/
  category_id: string
  country: string
  coverage_amount: number
  coverage_start_date: string /*Date*/
  coverage_status: ItemCoverageStatus
  description: string
  in_storage: boolean
  make: string
  model: string
  name: string
  purchase_date: string /*yyyy-mm-dd Date*/
  risk_category_id?: string
  serial_number: string
}

export type UpdatePolicyItemRequestBody = {
  accountable_person_id: string /*UUID*/
  category_id: string
  country: string
  coverage_amount: number
  coverage_start_date: string /*Date*/
  coverage_status: ItemCoverageStatus
  description: string
  in_storage: boolean
  make: string
  model: string
  name: string
  purchase_date: string /*yyyy-mm-dd Date*/
  risk_category_id?: string
  serial_number: string
}

export const itemsByPolicyId = writable<{ [policyId: string]: PolicyItem[] }>({})

/**
 * Load the items for the specified policy.
 *
 * @export
 * @param {string} policyId -- The UUID for the desired policy
 */
export async function loadItems(policyId: string): Promise<void> {
  const urlPath = `policies/${policyId}/items`

  const items = await GET<PolicyItem[]>(urlPath)
  itemsByPolicyId.update((data) => {
    // TODO: Sorting and filtering should really be done on the BE but that's not supported yet
    items.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    data[policyId] = items
    return data
  })
}

/**
 * Add an item.
 *
 * @export
 * @param {string} policyId -- The UUID for the applicable policy
 * @param {Object} itemData
 * @return {Object}
 */
export async function addItem(policyId: string, itemData: any): Promise<PolicyItem> {
  const urlPath = `policies/${policyId}/items`

  const parsedItemData: CreatePolicyItemRequestBody = {
    accountable_person_id: itemData.accountablePersonId,
    category_id: itemData.categoryId,
    country: itemData.country,
    coverage_amount: Number(itemData.marketValueUSD) * 100,
    coverage_start_date: itemData.coverageStartDate,
    coverage_status: itemData.coverageStatus,
    description: itemData.itemDescription,
    in_storage: itemData.inStorage,
    make: itemData.make,
    model: itemData.model,
    name: itemData.shortName,
    purchase_date: itemData.purchaseDate,
    serial_number: itemData.uniqueIdentifier,
  }

  const addedItem = await CREATE<PolicyItem>(urlPath, parsedItemData as any)

  itemsByPolicyId.update((data) => {
    const items = data[policyId] || []
    items.push(addedItem)
    data[policyId] = items
    return data
  })

  return addedItem
}

/**
 * Submit an item.
 *
 * @export
 * @param {string} policyId -- The UUID for the applicable policy
 * @param {string} itemId -- The UUID for the applicable policy item
 * @return {Object}
 */
export async function submitItem(policyId: string, itemId: string): Promise<void> {
  const urlPath = `items/${itemId}/submit`

  // TODO: update a store with this response data instead of doing a full reload
  const response = await CREATE<PolicyItem>(urlPath)

  await loadItems(policyId)
}

/**
 * Update an item.
 *
 * @export
 * @param {string} policyId -- The UUID for the applicable policy
 * @param {string} itemId -- The UUID for the applicable policy item
 * @param {Object} itemData
 * @return {Object}
 */
export async function updateItem(policyId: string, itemId: string, itemData: any): Promise<void> {
  if (!itemId) {
    throwError('item id not set')
  }
  const urlPath = `items/${itemId}`

  const parsedItemData: UpdatePolicyItemRequestBody = {
    accountable_person_id: itemData.accountablePersonId,
    category_id: itemData.categoryId,
    country: itemData.country,
    coverage_amount: Number(itemData.marketValueUSD) * 100,
    coverage_start_date: itemData.coverageStartDate,
    coverage_status: itemData.coverageStatus,
    description: itemData.itemDescription,
    in_storage: itemData.inStorage,
    make: itemData.make,
    model: itemData.model,
    name: itemData.shortName,
    purchase_date: itemData.purchaseDate,
    serial_number: itemData.uniqueIdentifier,
  }
  const updatedItem = await UPDATE<PolicyItem>(urlPath, parsedItemData)

  itemsByPolicyId.update((data) => {
    const items = data[policyId] || []
    const i = items.findIndex((item) => item.id === itemId)
    if (i === -1) {
      throwError('Failed to find local item to update it')
    }
    items[i] = updatedItem
    data[policyId] = items
    return data
  })
}

/**
 * Delete an item.
 *
 * @export
 * @param {string} policyId -- The UUID for the applicable policy
 * @param {string} itemId -- The UUID for the item to delete
 */
export async function deleteItem(policyId: string, itemId: string): Promise<any> {
  const urlPath = `items/${itemId}`

  // TODO: Check the contenst of the delete response before removing the item from the store
  const response = await DELETE(urlPath)

  itemsByPolicyId.update((data) => {
    const items = data[policyId] || []
    data[policyId] = items.filter((item) => item.id !== itemId)
    return data
  })
}
