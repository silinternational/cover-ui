import { GET } from '.'
import { start, stop } from '../components/progress'
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

export async function init() {
  loadCategories()
}

/**
 *
 * @description loads categories from backend
 * @export
 */
export async function loadCategories() {
  start('itemCategories')

  let catz = await GET<ItemCategory[]>('config/item-categories')

  stop('itemCategories')

  categories.set(catz)
  initialized.set(true)
}
