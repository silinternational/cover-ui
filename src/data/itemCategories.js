import { GET } from "."
import { start, stop } from "../components/progress"
import { writable } from "svelte/store"

export const categories = writable([])
export const initialized = writable(false)

export async function init() {
  loadCategories()
}

/**
 *
 * @description loads categories from backend
 * @export
 */
export async function loadCategories() {
  start()

  let catz = await GET('item-categories')

  stop()
  
  categories.set(catz)
  initialized.set(true)
}