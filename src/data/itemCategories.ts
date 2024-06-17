import { GET } from '.'
import { writable } from 'svelte/store'
import type { RiskCategory } from './types/items'

export type ItemCategory = {
  billing_period: number /*Number of months*/
  created_at: string /*Date*/
  help_text: string
  key: string
  id: string
  minimum_deductible: number
  minimum_premium: number
  name: string
  premium_factor: string
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
