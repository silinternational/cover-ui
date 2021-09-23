import { GET } from '.'
import { writable } from 'svelte/store'

export type ItemCategory = {
  created_at: string /*Date*/
  help_text: string
  id: string
  name: string
  risk_category: any /*RiskCategory*/
  updated_at: string /*Date*/
}

export const categories = writable<ItemCategory[]>([])
export const initialized = writable<boolean>(false)

export async function init(): Promise<void> {
  loadCategories()
}

/**
 *
 * @description loads categories from backend
 * @export
 */
export async function loadCategories(): Promise<ItemCategory[]> {
  const response = await GET<ItemCategory[]>('config/item-categories')

  categories.set(response)
  initialized.set(true)

  return response
}
