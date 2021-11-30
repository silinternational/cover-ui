import { CREATE, DELETE, GET, UPDATE } from '.'
import { throwError } from '../error'
import { derived, writable } from 'svelte/store'
import { selectedPolicyId } from './role-policy-selection'

export enum ItemCoverageStatus {
  Draft = 'Draft',
  Pending = 'Pending',
  Approved = 'Approved',
  Denied = 'Denied',
  Revision = 'Revision',
  Inactive = 'Inactive',
}
export const incompleteItemCoverageStatuses = [
  ItemCoverageStatus.Draft,
  ItemCoverageStatus.Pending,
  ItemCoverageStatus.Revision,
]

export type AccountablePerson = {
  id: string
  name: string
  country: string
}
export type RiskCategory = {
  created_at: string /*Date*/
  id: string
  name: string
  policy_max: number
  updated_at: string /*Date*/
}

export type PolicyItem = {
  accountable_person: AccountablePerson
  annual_premium: number
  category: any /*ItemCategory*/
  country: string
  coverage_amount: number
  coverage_end_date: string /*Date*/
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
  prorated_annual_premium: number
  risk_category: RiskCategory
  serial_number: string
  status_change: string
  status_reason: string
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
  risk_category_id?: string
  serial_number: string
}

export type UpdatePolicyItemRequestBody = {
  accountable_person_id: string /*UUID*/
  category_id: string
  country: string
  coverage_amount: number
  description: string
  in_storage: boolean
  make: string
  model: string
  name: string
  risk_category_id?: string
  serial_number: string
}

export const itemsByPolicyId = writable<{ [policyId: string]: PolicyItem[] }>({})
export const allPolicyItems = derived(itemsByPolicyId, ($itemsByPolicyId) => {
  return Object.values($itemsByPolicyId).flat()
})
export const selectedPolicyItems = derived(
  [itemsByPolicyId, selectedPolicyId],
  ([$itemsByPolicyId, $selectedPolicyId]) => {
    return $itemsByPolicyId[$selectedPolicyId] || []
  }
)

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
    items.sort((a, b) => Number(new Date(b.updated_at)) - Number(new Date(a.updated_at)))
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

export async function approveItem(itemId: string): Promise<PolicyItem> {
  const urlPath = `items/${itemId}/approve`

  const updatedItem = await CREATE<PolicyItem>(urlPath)

  updateStoreItem(updatedItem)

  return updatedItem
}

export async function denyItem(itemId: string, status_reason: string): Promise<PolicyItem> {
  const urlPath = `items/${itemId}/deny`
  const data = { status_reason }

  const updatedItem = await CREATE<PolicyItem>(urlPath, data)

  updateStoreItem(updatedItem)

  return updatedItem
}

export async function reviseItem(itemId: string, status_reason: string): Promise<PolicyItem> {
  const urlPath = `items/${itemId}/revision`
  const data = { status_reason }

  const updatedItem = await CREATE<PolicyItem>(urlPath, data)

  updateStoreItem(updatedItem)

  return updatedItem
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
    description: itemData.itemDescription,
    in_storage: itemData.inStorage,
    make: itemData.make,
    model: itemData.model,
    name: itemData.shortName,
    risk_category_id: itemData.riskCategoryId,
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

export const itemBelongsToPolicy = (policyId: string, item: PolicyItem): boolean => item.policy_id === policyId

function updateStoreItem(updatedItem: PolicyItem) {
  itemsByPolicyId.update((data) => {
    const items = data[updatedItem.policy_id] || []
    const itemIndex = items.findIndex((item) => item.id === updatedItem.id)
    items[itemIndex] = updatedItem
    data[updatedItem.policy_id] = items
    return data
  })
}
