import { GET } from '.'
import { writable } from 'svelte/store'
import type { RiskCategory } from './items'

export type itemCategoryName =
  | 'Appliances and home electronics'
  | 'Clothing'
  | 'Computers and accessories'
  | 'Bikes and Lightweight Vehicles'
  | 'Field electronics'
  | 'Furniture'
  | 'Home goods'
  | 'Medical'
  | 'Mobile phones'
  | 'Musical instruments'
  | 'Photography and videography'
  | 'Vehicles'
  | 'Other'

export type ItemCategory = {
  created_at: string /*Date*/
  help_text: string
  id: string
  name: itemCategoryName
  require_make_model: boolean
  risk_category: RiskCategory
  updated_at: string /*Date*/
}

export const categories = writable<ItemCategory[]>([])
export const initialized = writable<boolean>(false)

/**
 *
 * @description loads categories from backend
 * @export
 */
export async function loadCategories(): Promise<void> {
  const response = await GET<ItemCategory[]>('config/item-categories')

  categories.set(response)
  initialized.set(true)
}
