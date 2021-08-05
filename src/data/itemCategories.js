import { GET } from "."
import { writable } from "svelte/store";

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

    let catz = await GET('/item-categories')

    categories.set(catz)
    initialized.set(true)
}